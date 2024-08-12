import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { FeatureFlagKey } from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
import { FieldMetadataType } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { RelationMetadataType } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceGate } from 'src/engine/twenty-orm/decorators/workspace-gate.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { WORKFLOW_RUN_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { WorkflowVersionWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-version.workspace-entity';

export enum WorkflowRunStatus {
  NOT_STARTED = 'NOT_STARTED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.workflowRun,
  namePlural: 'workflowRuns',
  labelSingular: 'workflowRun',
  labelPlural: 'WorkflowRuns',
  description: 'A workflow run',
})
@WorkspaceGate({
  featureFlag: FeatureFlagKey.IsWorkflowEnabled,
})
@WorkspaceIsSystem()
export class WorkflowRunWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: WORKFLOW_RUN_STANDARD_FIELD_IDS.startedAt,
    type: FieldMetadataType.DATE_TIME,
    label: 'Workflow run started at',
    description: 'Workflow run started at',
    icon: 'IconHistory',
  })
  @WorkspaceIsNullable()
  startedAt: string | null;

  @WorkspaceField({
    standardId: WORKFLOW_RUN_STANDARD_FIELD_IDS.endedAt,
    type: FieldMetadataType.DATE_TIME,
    label: 'Workflow run ended at',
    description: 'Workflow run ended at',
    icon: 'IconHistory',
  })
  @WorkspaceIsNullable()
  endedAt: string | null;

  @WorkspaceField({
    standardId: WORKFLOW_RUN_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.TEXT,
    label: 'Workflow run status',
    description: 'Workflow run status',
    icon: 'IconHistory',
  })
  @WorkspaceIsNullable()
  status: WorkflowRunStatus;

  // Relations
  @WorkspaceRelation({
    standardId: WORKFLOW_RUN_STANDARD_FIELD_IDS.workflowVersion,
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Workflow',
    description: 'WorkflowVersion workflow',
    icon: 'IconVersions',
    inverseSideTarget: () => WorkflowVersionWorkspaceEntity,
    inverseSideFieldKey: 'runs',
  })
  @WorkspaceIsNullable()
  workflowVersion: Relation<WorkflowVersionWorkspaceEntity>;

  @WorkspaceJoinColumn('workflowVersion')
  workflowVersionId: string;
}
