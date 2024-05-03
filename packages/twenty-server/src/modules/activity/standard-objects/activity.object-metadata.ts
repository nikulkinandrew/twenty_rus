import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { FieldMetadataType } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import {
  RelationMetadataType,
  RelationOnDeleteAction,
} from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
import { ACTIVITY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { IsNullable } from 'src/engine/workspace-manager/workspace-sync-metadata/decorators/is-nullable.decorator';
import { ActivityTargetObjectMetadata } from 'src/modules/activity/standard-objects/activity-target.object-metadata';
import { AttachmentObjectMetadata } from 'src/modules/attachment/standard-objects/attachment.object-metadata';
import { CommentObjectMetadata } from 'src/modules/activity/standard-objects/comment.object-metadata';
import { WorkspaceMemberObjectMetadata } from 'src/modules/workspace-member/standard-objects/workspace-member.object-metadata';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-object.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.activity,
  namePlural: 'activities',
  labelSingular: 'Activity',
  labelPlural: 'Activities',
  description: 'An activity',
  icon: 'IconCheckbox',
})
@WorkspaceIsNotAuditLogged()
@WorkspaceIsSystem()
export class ActivityObjectMetadata extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: 'Title',
    description: 'Activity title',
    icon: 'IconNotes',
  })
  title: string;

  @WorkspaceField({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.body,
    type: FieldMetadataType.TEXT,
    label: 'Body',
    description: 'Activity body',
    icon: 'IconList',
  })
  body: string;

  @WorkspaceField({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.type,
    type: FieldMetadataType.TEXT,
    label: 'Type',
    description: 'Activity type',
    icon: 'IconCheckbox',
    defaultValue: "'Note'",
  })
  type: string;

  @WorkspaceField({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.reminderAt,
    type: FieldMetadataType.DATE_TIME,
    label: 'Reminder Date',
    description: 'Activity reminder date',
    icon: 'IconCalendarEvent',
  })
  @IsNullable()
  reminderAt: Date;

  @WorkspaceField({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.dueAt,
    type: FieldMetadataType.DATE_TIME,
    label: 'Due Date',
    description: 'Activity due date',
    icon: 'IconCalendarEvent',
  })
  @IsNullable()
  dueAt: Date;

  @WorkspaceField({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.completedAt,
    type: FieldMetadataType.DATE_TIME,
    label: 'Completion Date',
    description: 'Activity completion date',
    icon: 'IconCheck',
  })
  @IsNullable()
  completedAt: Date;

  @WorkspaceRelation({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.activityTargets,
    label: 'Targets',
    description: 'Activity targets',
    icon: 'IconCheckbox',
    type: RelationMetadataType.ONE_TO_MANY,
    inverseSideTarget: () => ActivityTargetObjectMetadata,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  activityTargets: Relation<ActivityTargetObjectMetadata[]>;

  @WorkspaceRelation({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.attachments,
    label: 'Attachments',
    description: 'Activity attachments',
    icon: 'IconFileImport',
    type: RelationMetadataType.ONE_TO_MANY,
    inverseSideTarget: () => AttachmentObjectMetadata,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  attachments: Relation<AttachmentObjectMetadata[]>;

  @WorkspaceRelation({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.comments,
    label: 'Comments',
    description: 'Activity comments',
    icon: 'IconComment',
    type: RelationMetadataType.ONE_TO_MANY,
    inverseSideTarget: () => CommentObjectMetadata,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  comments: Relation<CommentObjectMetadata[]>;

  @WorkspaceRelation({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.author,
    label: 'Author',
    description: 'Activity author',
    icon: 'IconUserCircle',
    type: RelationMetadataType.MANY_TO_ONE,
    inverseSideTarget: () => WorkspaceMemberObjectMetadata,
    inverseSideFieldKey: 'authoredActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
    joinColumn: 'authorId',
  })
  @WorkspaceIsNullable()
  author: Relation<WorkspaceMemberObjectMetadata>;

  @WorkspaceRelation({
    standardId: ACTIVITY_STANDARD_FIELD_IDS.assignee,
    label: 'Assignee',
    description: 'Activity assignee',
    icon: 'IconUserCircle',
    type: RelationMetadataType.MANY_TO_ONE,
    inverseSideTarget: () => WorkspaceMemberObjectMetadata,
    inverseSideFieldKey: 'assignedActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
    joinColumn: 'assigneeId',
  })
  @WorkspaceIsNullable()
  assignee: Relation<WorkspaceMemberObjectMetadata>;
}
