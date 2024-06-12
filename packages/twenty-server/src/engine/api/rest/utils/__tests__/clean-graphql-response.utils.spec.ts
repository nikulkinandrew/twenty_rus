import { cleanGraphQLResponse } from 'src/engine/api/rest/utils/clean-graphql-response.utils';

describe('cleanGraphQLResponse', () => {
  it('should remove edges/node from results', () => {
    const data = {
      companies: {
        edges: [
          {
            node: { id: 'id', createdAt: '2023-01-01' },
          },
        ],
      },
    };
    const expectedResult = {
      data: {
        companies: [{ id: 'id', createdAt: '2023-01-01' }],
      },
    };

    expect(cleanGraphQLResponse(data)).toEqual(expectedResult);
  });
  it('should remove nested edges/node from results', () => {
    const data = {
      companies: {
        edges: [
          {
            node: {
              id: 'id',
              createdAt: '2023-01-01',
              people: {
                edges: [{ node: { id: 'id1' } }, { node: { id: 'id2' } }],
              },
            },
          },
        ],
      },
    };
    const expectedResult = {
      data: {
        companies: [
          {
            id: 'id',
            createdAt: '2023-01-01',
            people: [{ id: 'id1' }, { id: 'id2' }],
          },
        ],
      },
    };

    expect(cleanGraphQLResponse(data)).toEqual(expectedResult);
  });
  it('should not format when no list returned', () => {
    const data = { company: { id: 'id' } };
    const expectedResult = {
      data: {
        company: { id: 'id' },
      },
    };

    expect(cleanGraphQLResponse(data)).toEqual(expectedResult);
  });
});
