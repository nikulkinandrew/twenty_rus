import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import chalk from 'chalk';
import { isDefined, isEmpty } from 'class-validator';
import { parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';
import { Command } from 'nest-commander';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import {
  ActiveWorkspacesCommandOptions,
  ActiveWorkspacesCommandRunner,
} from 'src/database/commands/active-workspaces.command';
import { TypeORMService } from 'src/database/typeorm/typeorm.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { CreateFieldInput } from 'src/engine/metadata-modules/field-metadata/dtos/create-field.input';
import { FieldMetadataDefaultValuePhones } from 'src/engine/metadata-modules/field-metadata/dtos/default-value.input';
import {
  FieldMetadataEntity,
  FieldMetadataType,
} from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/field-metadata.service';
import { computeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { computeTableName } from 'src/engine/utils/compute-table-name.util';
import { PERSON_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { ViewService } from 'src/modules/view/services/view.service';
import { ViewFieldWorkspaceEntity } from 'src/modules/view/standard-objects/view-field.workspace-entity';

type MigratePhoneFieldsToPhonesCommandOptions = ActiveWorkspacesCommandOptions;
@Command({
  name: 'upgrade-0.32:migrate-phone-fields-to-phones',
  description: 'Migrating fields of deprecated type PHONE to type PHONES',
})
export class MigratePhoneFieldsToPhonesCommand extends ActiveWorkspacesCommandRunner {
  constructor(
    @InjectRepository(Workspace, 'core')
    protected readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(FieldMetadataEntity, 'metadata')
    private readonly fieldMetadataRepository: Repository<FieldMetadataEntity>,
    @InjectRepository(ObjectMetadataEntity, 'metadata')
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
    @InjectDataSource('metadata')
    private readonly metadataDataSource: DataSource,
    private readonly fieldMetadataService: FieldMetadataService,
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly typeORMService: TypeORMService,
    private readonly dataSourceService: DataSourceService,
    private readonly viewService: ViewService,
  ) {
    super(workspaceRepository);
  }

  async executeActiveWorkspacesCommand(
    _passedParam: string[],
    _options: MigratePhoneFieldsToPhonesCommandOptions,
    workspaceIds: string[],
  ): Promise<void> {
    this.logger.log(
      'Running command to migrate phone type fields to phones type',
    );

    for (const workspaceId of workspaceIds) {
      this.logger.log(`Running command for workspace ${workspaceId}`);
      try {
        const dataSourceMetadata =
          await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceId(
            workspaceId,
          );

        if (!dataSourceMetadata) {
          throw new Error(
            `Could not find dataSourceMetadata for workspace ${workspaceId}`,
          );
        }
        const workspaceDataSource =
          await this.typeORMService.connectToDataSource(dataSourceMetadata);

        if (!workspaceDataSource) {
          throw new Error(
            `Could not connect to dataSource for workspace ${workspaceId}`,
          );
        }
        const standardPersonPhoneFieldWithTextType =
          await this.fieldMetadataRepository.findOneBy({
            workspaceId,
            standardId: PERSON_STANDARD_FIELD_IDS.phone,
          });

        if (!standardPersonPhoneFieldWithTextType) {
          throw new Error(
            `Could not find standard phone field on person for workspace ${workspaceId}`,
          );
        }

        const standardPersonPhonesFieldType =
          await this.fieldMetadataRepository.findOneBy({
            workspaceId,
            standardId: PERSON_STANDARD_FIELD_IDS.phones,
          });

        if (!isDefined(standardPersonPhonesFieldType)) {
          await this.migrateStandardPersonPhoneField({
            standardPersonPhoneField: standardPersonPhoneFieldWithTextType,
            workspaceDataSource,
            workspaceSchemaName: dataSourceMetadata.schema,
          });
        }

        const fieldsWithPhoneType = await this.fieldMetadataRepository.find({
          where: {
            workspaceId,
            type: FieldMetadataType.PHONE,
          },
        });

        for (const deprecatedPhoneField of fieldsWithPhoneType) {
          this.migrateCustomPhoneField({
            phoneField: deprecatedPhoneField,
            workspaceDataSource,
            workspaceSchemaName: dataSourceMetadata.schema,
          });
        }
      } catch (error) {
        this.logger.log(
          chalk.red(
            `Field migration on workspace ${workspaceId} failed with error: ${error}`,
          ),
        );
        continue;
      }
      this.logger.log(chalk.green(`Command completed!`));
    }
  }

  private async migrateStandardPersonPhoneField({
    standardPersonPhoneField,
    workspaceDataSource,
    workspaceSchemaName,
  }: {
    standardPersonPhoneField: FieldMetadataEntity;
    workspaceDataSource: DataSource;
    workspaceSchemaName: string;
  }) {
    const personObjectMetadata = await this.objectMetadataRepository.findOne({
      where: { id: standardPersonPhoneField.objectMetadataId },
    });

    if (!personObjectMetadata) {
      throw new Error(
        `Could not find Person objectMetadata (id ${standardPersonPhoneField.objectMetadataId})`,
      );
    }

    this.logger.log(`Attempting to migrate standard person phone field.`);
    const workspaceQueryRunner = workspaceDataSource.createQueryRunner();

    await workspaceQueryRunner.connect();
    const { id: _id, ...deprecatedPhoneFieldWithoutId } =
      standardPersonPhoneField;
    const phoneDefaultValue = deprecatedPhoneFieldWithoutId.defaultValue;
    let parsedPhoneDefaultValue: PhoneNumber | null = null;
    let defaultValueForPhonesField: FieldMetadataDefaultValuePhones | null =
      null;

    if (isDefined(phoneDefaultValue) && !isEmpty(phoneDefaultValue)) {
      try {
        parsedPhoneDefaultValue = parsePhoneNumber(phoneDefaultValue as string);
        defaultValueForPhonesField = {
          primaryPhoneCountryCode: `+${parsedPhoneDefaultValue.countryCallingCode}`,
          primaryPhoneNumber: parsedPhoneDefaultValue.nationalNumber,
          additionalPhones: null,
        };
      } catch (error) {
        this.logger.log(
          `Failed to parse phone number (${phoneDefaultValue}) for default value. Setting default value to null.`,
        );
      }
    }

    const workspaceId = standardPersonPhoneField.workspaceId;

    try {
      const newPhonesField = await this.fieldMetadataService.createOne({
        ...deprecatedPhoneFieldWithoutId,
        type: FieldMetadataType.PHONES,
        defaultValue: defaultValueForPhonesField,
        name: 'phones',
      } satisfies CreateFieldInput);

      // Copy phone data from Text type to Phones type
      await this.copyAndParseDeprecatedPhoneFieldDataIntoNewPhonesField({
        workspaceQueryRunner,
        workspaceSchemaName,
      });

      // Add new phones field to views and hide deprecated phone field
      const viewFieldRepository =
        await this.twentyORMGlobalManager.getRepositoryForWorkspace<ViewFieldWorkspaceEntity>(
          workspaceId,
          'viewField',
        );
      const viewFieldsWithDeprecatedPhoneField = await viewFieldRepository.find(
        {
          where: {
            fieldMetadataId: standardPersonPhoneField.id,
            isVisible: true,
          },
        },
      );

      await this.viewService.addFieldToViews({
        workspaceId: workspaceId,
        fieldId: newPhonesField.id,
        viewsIds: viewFieldsWithDeprecatedPhoneField
          .filter((viewField) => viewField.viewId !== null)
          .map((viewField) => viewField.viewId as string),
        positions: viewFieldsWithDeprecatedPhoneField.reduce(
          (acc, viewField) => {
            if (!viewField.viewId) {
              return acc;
            }
            acc[viewField.viewId] = viewField.position;

            return acc;
          },
          [],
        ),
      });

      await this.viewService.removeFieldFromViews({
        workspaceId: workspaceId,
        fieldId: standardPersonPhoneField.id,
      });

      this.logger.log(
        `Migration of standard person phone field to phones is done!`,
      );
    } catch (error) {
      this.logger.log(
        chalk.red(
          `Failed to migrate field standard person phone field to phones, rolling back.`,
        ),
      );

      // Delete new phones field if it was created
      const newPhonesField =
        await this.fieldMetadataService.findOneWithinWorkspace(workspaceId, {
          where: {
            name: 'phones',
            objectMetadataId: standardPersonPhoneField.objectMetadataId,
          },
        });

      if (newPhonesField) {
        this.logger.log(
          `Deleting phones field of type Phone as part of rolling back.`,
        );
        this.fieldMetadataService.deleteOneField(
          { id: newPhonesField.id },
          workspaceId,
        );
      }
    } finally {
      await workspaceQueryRunner.release();
    }
  }

  private async migrateCustomPhoneField({
    phoneField,
    workspaceDataSource,
    workspaceSchemaName,
  }: {
    phoneField: FieldMetadataEntity;
    workspaceDataSource: DataSource;
    workspaceSchemaName: string;
  }) {
    if (!phoneField) return;
    const objectMetadata = await this.objectMetadataRepository.findOne({
      where: { id: phoneField.objectMetadataId },
    });

    if (!objectMetadata) {
      throw new Error(
        `Could not find objectMetadata for field ${phoneField.name}`,
      );
    }
    this.logger.log(
      `Attempting to migrate field ${phoneField.name} on ${objectMetadata.nameSingular} from Phone to Text.`,
    );
    const workspaceQueryRunner = workspaceDataSource.createQueryRunner();

    await workspaceQueryRunner.connect();

    try {
      await this.metadataDataSource.query(
        `UPDATE "metadata"."fieldMetadata" SET "type" = $1 where "id"=$2`,
        [FieldMetadataType.TEXT, phoneField.id],
      );

      await workspaceQueryRunner.query(
        `ALTER TABLE "${workspaceSchemaName}"."${computeTableName(objectMetadata.nameSingular, objectMetadata.isCustom)}" ALTER COLUMN "${computeColumnName(phoneField.name)}" TYPE TEXT`,
      );
    } catch (error) {
      this.logger.log(
        chalk.red(
          `Failed to migrate field ${phoneField.name} on ${objectMetadata.nameSingular} from Phone to Text.`,
        ),
      );
    } finally {
      workspaceQueryRunner.release();
    }
  }

  private async copyAndParseDeprecatedPhoneFieldDataIntoNewPhonesField({
    workspaceQueryRunner,
    workspaceSchemaName,
  }: {
    workspaceQueryRunner: QueryRunner;
    workspaceSchemaName: string;
  }) {
    const deprecatedPhoneFieldRows = await workspaceQueryRunner.query(
      `SELECT id, phone FROM "${workspaceSchemaName}"."person" WHERE 
      phone IS NOT null`,
    );

    for (const row of deprecatedPhoneFieldRows) {
      const phoneColumnValue = row['phone'];

      const query = `UPDATE "${workspaceSchemaName}"."person" SET "phonesPrimaryPhoneCountryCode" = $1,"phonePrimaryPhoneNumber" = $2 where "id"=$3`;

      try {
        const parsedPhoneColumnValue = parsePhoneNumber(phoneColumnValue);

        await workspaceQueryRunner.query(query, [
          `+${parsedPhoneColumnValue.countryCallingCode}`,
          parsedPhoneColumnValue.nationalNumber,
          row.id,
        ]);
      } catch (error) {
        this.logger.log(
          chalk.red(
            `Could not save phone number ${phoneColumnValue}, will try again storing value as is without parsing, with default country code.`,
          ),
        );
        // Store the invalid string for invalid phone numbers
        await workspaceQueryRunner.query(query, ['', phoneColumnValue, row.id]);
      }
    }
  }
}
