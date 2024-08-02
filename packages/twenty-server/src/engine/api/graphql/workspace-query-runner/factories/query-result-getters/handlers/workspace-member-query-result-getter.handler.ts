import { QueryResultGuetterHandlerInterface } from 'src/engine/api/graphql/workspace-query-runner/factories/query-result-getters/interfaces/query-result-getter-handler.interface';

import { FileService } from 'src/engine/core-modules/file/services/file.service';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class WorkspaceMemberQueryResultGetterHandler
  implements QueryResultGuetterHandlerInterface
{
  constructor(private readonly fileService: FileService) {}

  async process(
    workspaceMember: WorkspaceMemberWorkspaceEntity,
    workspaceId: string,
  ): Promise<any> {
    if (!workspaceMember.id || !workspaceMember?.avatarUrl) {
      return workspaceMember;
    }

    const signedPayload = await this.fileService.encodeFile({
      workspace_member_id: workspaceMember.id,
      workspace_id: workspaceId,
    });

    return {
      ...workspaceMember,
      avatarUrl: `${workspaceMember.avatarUrl}?token=${signedPayload}`,
    };
  }
}
