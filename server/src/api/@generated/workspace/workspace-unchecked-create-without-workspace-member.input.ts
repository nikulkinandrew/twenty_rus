import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { CompanyUncheckedCreateNestedManyWithoutWorkspaceInput } from '../company/company-unchecked-create-nested-many-without-workspace.input';
import { PersonUncheckedCreateNestedManyWithoutWorkspaceInput } from '../person/person-unchecked-create-nested-many-without-workspace.input';
import { CommentThreadUncheckedCreateNestedManyWithoutWorkspaceInput } from '../comment-thread/comment-thread-unchecked-create-nested-many-without-workspace.input';
import { CommentUncheckedCreateNestedManyWithoutWorkspaceInput } from '../comment/comment-unchecked-create-nested-many-without-workspace.input';
import { PipelineUncheckedCreateNestedManyWithoutWorkspaceInput } from '../pipeline/pipeline-unchecked-create-nested-many-without-workspace.input';
import { PipelineStageUncheckedCreateNestedManyWithoutWorkspaceInput } from '../pipeline-stage/pipeline-stage-unchecked-create-nested-many-without-workspace.input';

@InputType()
export class WorkspaceUncheckedCreateWithoutWorkspaceMemberInput {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | string;

  @Field(() => String, { nullable: false })
  domainName!: string;

  @Field(() => String, { nullable: false })
  displayName!: string;

  @Field(() => String, { nullable: true })
  logo?: string;

  @Field(() => CompanyUncheckedCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  companies?: CompanyUncheckedCreateNestedManyWithoutWorkspaceInput;

  @Field(() => PersonUncheckedCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  people?: PersonUncheckedCreateNestedManyWithoutWorkspaceInput;

  @Field(() => CommentThreadUncheckedCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  commentThreads?: CommentThreadUncheckedCreateNestedManyWithoutWorkspaceInput;

  @Field(() => CommentUncheckedCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  comments?: CommentUncheckedCreateNestedManyWithoutWorkspaceInput;

  @Field(() => PipelineUncheckedCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  pipelines?: PipelineUncheckedCreateNestedManyWithoutWorkspaceInput;

  @Field(() => PipelineStageUncheckedCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  pipelineStages?: PipelineStageUncheckedCreateNestedManyWithoutWorkspaceInput;
}
