import * as TypeGraphQL from '@nestjs/graphql';
import * as GraphQLScalars from 'graphql-scalars';
import { Prisma } from '@prisma/client';
import { DecimalJSScalar } from '../../scalars';
import { CompanyCreateNestedManyWithoutWorkspaceInput } from '../inputs/CompanyCreateNestedManyWithoutWorkspaceInput';
import { PersonCreateNestedManyWithoutWorkspaceInput } from '../inputs/PersonCreateNestedManyWithoutWorkspaceInput';
import { WorkspaceMemberCreateNestedManyWithoutWorkspaceInput } from '../inputs/WorkspaceMemberCreateNestedManyWithoutWorkspaceInput';

@TypeGraphQL.InputType('WorkspaceCreateInput', {
  isAbstract: true,
})
export class WorkspaceCreateInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  id!: string;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  deletedAt?: Date | undefined;

  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  domainName!: string;

  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  displayName!: string;

  @TypeGraphQL.Field(
    (_type) => WorkspaceMemberCreateNestedManyWithoutWorkspaceInput,
    {
      nullable: true,
    },
  )
  WorkspaceMember?:
    | WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    | undefined;

  @TypeGraphQL.Field((_type) => CompanyCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  companies?: CompanyCreateNestedManyWithoutWorkspaceInput | undefined;

  @TypeGraphQL.Field((_type) => PersonCreateNestedManyWithoutWorkspaceInput, {
    nullable: true,
  })
  people?: PersonCreateNestedManyWithoutWorkspaceInput | undefined;
}
