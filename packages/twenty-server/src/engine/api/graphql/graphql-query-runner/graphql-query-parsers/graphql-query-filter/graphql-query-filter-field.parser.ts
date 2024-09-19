import { ObjectLiteral, WhereExpressionBuilder } from 'typeorm';

import { FieldMetadataInterface } from 'src/engine/metadata-modules/field-metadata/interfaces/field-metadata.interface';

import {
  GraphqlQueryRunnerException,
  GraphqlQueryRunnerExceptionCode,
} from 'src/engine/api/graphql/graphql-query-runner/errors/graphql-query-runner.exception';
import { compositeTypeDefinitions } from 'src/engine/metadata-modules/field-metadata/composite-types';
import { isCompositeFieldMetadataType } from 'src/engine/metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util';
import { FieldMetadataMap } from 'src/engine/metadata-modules/utils/generate-object-metadata-map.util';
import { CompositeFieldMetadataType } from 'src/engine/metadata-modules/workspace-migration/factories/composite-column-action.factory';
import { capitalize } from 'src/utils/capitalize';

type WhereConditionParts = {
  sql: string;
  params: ObjectLiteral;
};

export class GraphqlQueryFilterFieldParser {
  private fieldMetadataMap: FieldMetadataMap;

  constructor(fieldMetadataMap: FieldMetadataMap) {
    this.fieldMetadataMap = fieldMetadataMap;
  }

  public parse(
    queryBuilder: WhereExpressionBuilder,
    objectNameSingular: string,
    key: string,
    filterValue: any,
    isFirst = false,
  ): void {
    const fieldMetadata = this.fieldMetadataMap[key];

    if (!fieldMetadata) {
      throw new Error(`Field metadata not found for field: ${key}`);
    }

    if (isCompositeFieldMetadataType(fieldMetadata.type)) {
      return this.parseCompositeFieldForFilter(
        queryBuilder,
        fieldMetadata,
        objectNameSingular,
        filterValue,
        isFirst,
      );
    }
    const [[operator, value]] = Object.entries(filterValue);

    const { sql, params } = this.computeWhereConditionParts(
      fieldMetadata,
      operator,
      objectNameSingular,
      key,
      value,
    );

    if (isFirst) {
      queryBuilder.where(sql, params);
    }

    queryBuilder.andWhere(sql, params);
  }

  private computeWhereConditionParts(
    fieldMetadata: FieldMetadataInterface,
    operator: string,
    objectNameSingular: string,
    key: string,
    value: any,
  ): WhereConditionParts {
    switch (operator) {
      case 'eq':
        return {
          sql: `${objectNameSingular}.${key} = :${key}`,
          params: { [key]: value },
        };
      case 'neq':
        return {
          sql: `${objectNameSingular}.${key} != :${key}`,
          params: { [key]: value },
        };
      case 'gt':
        return {
          sql: `${objectNameSingular}.${key} > :${key}`,
          params: { [key]: value },
        };
      case 'gte':
        return {
          sql: `${objectNameSingular}.${key} >= :${key}`,
          params: { [key]: value },
        };
      case 'lt':
        return {
          sql: `${objectNameSingular}.${key} < :${key}`,
          params: { [key]: value },
        };
      case 'lte':
        return {
          sql: `${objectNameSingular}.${key} <= :${key}`,
          params: { [key]: value },
        };
      case 'in':
        return {
          sql: `${objectNameSingular}.${key} IN (:...${key})`,
          params: { [key]: value },
        };
      case 'is':
        return {
          sql: `${objectNameSingular}.${key} IS ${value === 'NULL' ? 'NULL' : 'NOT NULL'}`,
          params: {},
        };
      case 'like':
        return {
          sql: `${objectNameSingular}.${key} LIKE :${key}`,
          params: { [key]: `${value}` },
        };
      case 'ilike':
        return {
          sql: `${objectNameSingular}.${key} ILIKE :${key}`,
          params: { [key]: `${value}` },
        };
      case 'startsWith':
        return {
          sql: `${objectNameSingular}.${key} LIKE :${key}`,
          params: { [key]: `${value}` },
        };
      case 'endsWith':
        return {
          sql: `${objectNameSingular}.${key} LIKE :${key}`,
          params: { [key]: `${value}` },
        };
      default:
        throw new GraphqlQueryRunnerException(
          `Operator "${operator}" is not supported`,
          GraphqlQueryRunnerExceptionCode.UNSUPPORTED_OPERATOR,
        );
    }
  }

  private parseCompositeFieldForFilter(
    queryBuilder: WhereExpressionBuilder,
    fieldMetadata: FieldMetadataInterface,
    objectNameSingular: string,
    fieldValue: any,
    isFirst = false,
  ): void {
    const compositeType = compositeTypeDefinitions.get(
      fieldMetadata.type as CompositeFieldMetadataType,
    );

    if (!compositeType) {
      throw new Error(
        `Composite type definition not found for type: ${fieldMetadata.type}`,
      );
    }

    Object.entries(fieldValue).map(([subFieldKey, subFieldFilter], index) => {
      const subFieldMetadata = compositeType.properties.find(
        (property) => property.name === subFieldKey,
      );

      if (!subFieldMetadata) {
        throw new Error(
          `Sub field metadata not found for composite type: ${fieldMetadata.type}`,
        );
      }

      const fullFieldName = `${fieldMetadata.name}${capitalize(subFieldKey)}`;

      const [[operator, value]] = Object.entries(
        subFieldFilter as Record<string, any>,
      );

      const { sql, params } = this.computeWhereConditionParts(
        fieldMetadata,
        operator,
        objectNameSingular,
        fullFieldName,
        value,
      );

      if (isFirst && index === 0) {
        queryBuilder.where(sql, params);
      }

      queryBuilder.andWhere(sql, params);
    });
  }
}
