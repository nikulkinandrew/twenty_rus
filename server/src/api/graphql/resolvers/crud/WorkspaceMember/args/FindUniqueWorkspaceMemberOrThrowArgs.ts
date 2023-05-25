import * as TypeGraphQL from '@nestjs/graphql';
import * as GraphQLScalars from 'graphql-scalars';
import { WorkspaceMemberWhereUniqueInput } from '../../../inputs/WorkspaceMemberWhereUniqueInput';

@TypeGraphQL.ArgsType()
export class FindUniqueWorkspaceMemberOrThrowArgs {
  @TypeGraphQL.Field((_type) => WorkspaceMemberWhereUniqueInput, {
    nullable: false,
  })
  where!: WorkspaceMemberWhereUniqueInput;
}
