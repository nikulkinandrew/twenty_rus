import { DataSource } from 'typeorm';

const tableName = 'views';

export const seedViews = async (
  workspaceDataSource: DataSource,
  schemaName: string,
) => {
  await workspaceDataSource
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`)
    .values([
      {
        id: '37a8a866-eb17-4e76-9382-03143a2f6a80',
        name: 'All companies',
        objectId: 'company',
        type: 'table',
      },
      {
        id: '6095799e-b48f-4e00-b071-10818083593a',
        name: 'All people',
        objectId: 'person',
        type: 'table',
      },
      {
        id: 'e26f66b7-f890-4a5c-b4d2-ec09987b5308',
        name: 'All opportunities',
        objectId: 'company',
        type: 'kanban',
      },
      {
        id: '10bec73c-0aea-4cc4-a3b2-8c2186f29b43',
        name: 'All Companies (V2)',
        objectId: '1a8487a0-480c-434e-b4c7-e22408b97047',
        type: 'table',
      },
    ])
    .execute();
};
