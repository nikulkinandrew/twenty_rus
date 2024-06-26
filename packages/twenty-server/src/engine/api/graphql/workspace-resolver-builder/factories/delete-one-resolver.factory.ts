import { Injectable } from '@nestjs/common';

import {
  DeleteOneResolverArgs,
  Resolver,
} from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';
import { WorkspaceSchemaBuilderContext } from 'src/engine/api/graphql/workspace-schema-builder/interfaces/workspace-schema-builder-context.interface';
import { WorkspaceResolverBuilderFactoryInterface } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolver-builder-factory.interface';

import { WorkspaceQueryRunnerService } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-runner.service';
import { workspaceResolverErrorHandler } from 'src/engine/api/graphql/workspace-resolver-builder/utils/workspace-resolver-error-handler.util';

@Injectable()
export class DeleteOneResolverFactory
  implements WorkspaceResolverBuilderFactoryInterface
{
  public static methodName = 'deleteOne' as const;

  constructor(
    private readonly workspaceQueryRunnerService: WorkspaceQueryRunnerService,
  ) {}

  create(
    context: WorkspaceSchemaBuilderContext,
  ): Resolver<DeleteOneResolverArgs> {
    const internalContext = context;

    return (_source, args, context, info) => {
      return this.workspaceQueryRunnerService
        .deleteOne(args, {
          objectMetadataItem: internalContext.objectMetadataItem,
          workspaceId: internalContext.workspaceId,
          userId: internalContext.userId,
          info,
          fieldMetadataCollection: internalContext.fieldMetadataCollection,
          objectMetadataCollection: internalContext.objectMetadataCollection,
        })
        .catch(workspaceResolverErrorHandler);
    };
  }
}
