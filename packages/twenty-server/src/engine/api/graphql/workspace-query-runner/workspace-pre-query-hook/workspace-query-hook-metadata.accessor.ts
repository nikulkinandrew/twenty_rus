/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { HOOK_METADATA } from 'src/engine/api/graphql/workspace-query-runner/workspace-pre-query-hook/workspace-query-hook.constants';
import { WorkspaceQueryHookOptions } from 'src/engine/api/graphql/workspace-query-runner/workspace-pre-query-hook/decorators/workspace-query-hook.decorator';

@Injectable()
export class WorkspaceQueryHookMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  isWorkspaceQueryHook(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }

    return !!this.reflector.get(HOOK_METADATA, target);
  }

  getWorkspaceQueryHookMetadata(
    target: Type<any> | Function,
  ): WorkspaceQueryHookOptions | undefined {
    return this.reflector.get(HOOK_METADATA, target);
  }
}
