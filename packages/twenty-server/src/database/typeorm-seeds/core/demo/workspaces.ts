import { WorkspaceActivationStatus } from 'packages/twenty-shared/dist';
import { DataSource } from 'typeorm';

const tableName = 'workspace';

export const seedWorkspaces = async (
  workspaceDataSource: DataSource,
  schemaName: string,
  workspaceId: string,
) => {
  await workspaceDataSource
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'id',
      'displayName',
      'domainName',
      'inviteHash',
      'logo',
      'subdomain',
      'activationStatus',
    ])
    .orIgnore()
    .values([
      {
        id: workspaceId,
        displayName: 'Demo',
        domainName: 'demo.dev',
        inviteHash: 'demo.dev-invite-hash',
        logo: 'https://twentyhq.github.io/placeholder-images/workspaces/apple-logo.png',
        subdomain: 'demo',
        activationStatus: WorkspaceActivationStatus.Active,
      },
    ])
    .execute();
};

export const deleteWorkspaces = async (
  workspaceDataSource: DataSource,
  schemaName: string,
  workspaceId: string,
) => {
  await workspaceDataSource
    .createQueryBuilder()
    .delete()
    .from(`${schemaName}.${tableName}`)
    .where(`${tableName}."id" = :id`, { id: workspaceId })
    .execute();
};
