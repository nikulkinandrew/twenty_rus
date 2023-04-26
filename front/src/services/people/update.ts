import { FetchResult, gql } from '@apollo/client';
import { Person, mapGqlPerson } from '../../interfaces/person.interface';
import { apiClient } from '../../apollo';

export const UPDATE_PERSON = gql`
  mutation UpdatePeople(
    $id: uuid
    $firstname: String
    $lastname: String
    $phone: String
    $city: String
    $company_id: uuid
    $email: String
  ) {
    update_people(
      where: { id: { _eq: $id } }
      _set: {
        city: $city
        company_id: $company_id
        email: $email
        firstname: $firstname
        id: $id
        lastname: $lastname
        phone: $phone
      }
    ) {
      returning {
        city
        company {
          domain_name
          name
          id
        }
        email
        firstname
        id
        lastname
        phone
      }
    }
  }
`;

export async function updatePerson(
  person: Person,
): Promise<FetchResult<Person>> {
  const result = await apiClient.mutate({
    mutation: UPDATE_PERSON,
    variables: mapGqlPerson(person),
  });
  return result;
}
