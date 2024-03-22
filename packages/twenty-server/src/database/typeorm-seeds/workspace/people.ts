import { EntityManager } from 'typeorm';

const tableName = 'person';

export const seedPeople = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'id',
      'nameFirstName',
      'nameLastName',
      'phone',
      'city',
      'companyId',
      'email',
      'position',
    ])
    .orIgnore()
    .values([
      {
        id: '86083141-1c0e-494c-a1b6-85b1c6fefaa5',
        nameFirstName: 'Christoph',
        nameLastName: 'Callisto',
        phone: '+33789012345',
        city: 'Seattle',
        companyId: 'fe256b39-3ec3-4fe3-8997-b76aa0bfa408',
        email: 'christoph.calisto@linkedin.com',
        position: 1,
      },
      {
        id: '0aa00beb-ac73-4797-824e-87a1f5aea9e0',
        nameFirstName: 'Sylvie',
        nameLastName: 'Palmer',
        phone: '+33780123456',
        city: 'Los Angeles',
        companyId: 'fe256b39-3ec3-4fe3-8997-b76aa0bfa408',
        email: 'sylvie.palmer@linkedin.com',
        position: 2,
      },
      {
        id: '93c72d2e-f517-42fd-80ae-14173b3b70ae',
        nameFirstName: 'Christopher',
        nameLastName: 'Gonzalez',
        phone: '+33789012345',
        city: 'Seattle',
        companyId: '118995f3-5d81-46d6-bf83-f7fd33ea6102',
        email: 'christopher.gonzalez@qonto.com',
        position: 3,
      },
      {
        id: 'eeeacacf-eee1-4690-ad2c-8619e5b56a2e',
        nameFirstName: 'Ashley',
        nameLastName: 'Parker',
        phone: '+33780123456',
        city: 'Los Angeles',
        companyId: '118995f3-5d81-46d6-bf83-f7fd33ea6102',
        email: 'ashley.parker@qonto.com',
        position: 4,
      },
      {
        id: '9b324a88-6784-4449-afdf-dc62cb8702f2',
        nameFirstName: 'Nicholas',
        nameLastName: 'Wright',
        phone: '+33781234567',
        city: 'Seattle',
        companyId: '460b6fb1-ed89-413a-b31a-962986e67bb4',
        email: 'nicholas.wright@microsoft.com',
        position: 5,
      },
      {
        id: '1d151852-490f-4466-8391-733cfd66a0c8',
        nameFirstName: 'Isabella',
        nameLastName: 'Scott',
        phone: '+33782345678',
        city: 'New York',
        companyId: '460b6fb1-ed89-413a-b31a-962986e67bb4',
        email: 'isabella.scott@microsoft.com',
        position: 6,
      },
      {
        id: '98406e26-80f1-4dff-b570-a74942528de3',
        nameFirstName: 'Matthew',
        nameLastName: 'Green',
        phone: '+33783456789',
        city: 'Seattle',
        companyId: '460b6fb1-ed89-413a-b31a-962986e67bb4',
        email: 'matthew.green@microsoft.com',
        position: 7,
      },
      {
        id: 'a2e78a5f-338b-46df-8811-fa08c7d19d35',
        nameFirstName: 'Elizabeth',
        nameLastName: 'Baker',
        phone: '+33784567890',
        city: 'New York',
        companyId: '0d940997-c21e-4ec2-873b-de4264d89025',
        email: 'elizabeth.baker@airbnb.com',
        position: 8,
      },
      {
        id: 'ca1f5bf3-64ad-4b0e-bbfd-e9fd795b7016',
        nameFirstName: 'Christopher',
        nameLastName: 'Nelson',
        phone: '+33785678901',
        city: 'San Francisco',
        companyId: '0d940997-c21e-4ec2-873b-de4264d89025',
        email: 'christopher.nelson@airbnb.com',
        position: 9,
      },
      {
        id: '56955422-5d54-41b7-ba36-f0d20e1417ae',
        nameFirstName: 'Avery',
        nameLastName: 'Carter',
        phone: '+33786789012',
        city: 'New York',
        companyId: '0d940997-c21e-4ec2-873b-de4264d89025',
        email: 'avery.carter@airbnb.com',
        position: 10,
      },
      {
        id: '755035db-623d-41fe-92e7-dd45b7c568e1',
        nameFirstName: 'Ethan',
        nameLastName: 'Mitchell',
        phone: '+33787890123',
        city: 'Los Angeles',
        companyId: '0d940997-c21e-4ec2-873b-de4264d89025',
        email: 'ethan.mitchell@google.com',
        position: 11,
      },
      {
        id: '240da2ec-2d40-4e49-8df4-9c6a049190ef',
        nameFirstName: 'Madison',
        nameLastName: 'Perez',
        phone: '+33788901234',
        city: 'Seattle',
        companyId: '0d940997-c21e-4ec2-873b-de4264d89025',
        email: 'madison.perez@google.com',
        position: 12,
      },
      {
        id: '240da2ec-2d40-4e49-8df4-9c6a049190df',
        nameFirstName: 'Bertrand',
        nameLastName: 'Voulzy',
        phone: '+33788901234',
        city: 'Seattle',
        companyId: '0d940997-c21e-4ec2-873b-de4264d89025',
        email: 'bertrand.voulzy@google.com',
        position: 13,
      },
      {
        id: '240da2ec-2d40-4e49-8df4-9c6a049191de',
        nameFirstName: 'Louis',
        nameLastName: 'Duss',
        phone: '+33788901234',
        city: 'Seattle',
        companyId: 'a7bc68d5-f79e-40dd-bd06-c36e6abb4678',
        email: 'louis.duss@google.com',
        position: 14,
      },
      {
        id: '240da2ec-2d40-4e49-8df4-9c6a049191df',
        nameFirstName: 'Lorie',
        nameLastName: 'Vladim',
        phone: '+33788901235',
        city: 'Seattle',
        companyId: 'a674fa6c-1455-4c57-afaf-dd5dc086361d',
        email: 'lorie.vladim@google.com',
        position: 15,
      },
    ])
    .execute();
};
