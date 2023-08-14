import { gql } from '@apollo/client';

export const SEARCH_PEOPLE_QUERY = gql`
  query SearchPeople(
    $where: PersonWhereInput
    $limit: Int
    $orderBy: [PersonOrderByWithRelationInput!]
  ) {
    searchResults: findManyPerson(
      where: $where
      take: $limit
      orderBy: $orderBy
    ) {
      id
      phone
      email
      city
      firstName
      lastName
      displayName
      avatarUrl
      createdAt
    }
  }
`;

export const SEARCH_USER_QUERY = gql`
  query SearchUser(
    $where: UserWhereInput
    $limit: Int
    $orderBy: [UserOrderByWithRelationInput!]
  ) {
    searchResults: findManyUser(
      where: $where
      take: $limit
      orderBy: $orderBy
    ) {
      id
      email
      displayName
      firstName
      lastName
      avatarUrl
    }
  }
`;
// TODO: remove this query
export const EMPTY_QUERY = gql`
  query EmptyQuery {
    searchResults: findManyUser {
      id
    }
  }
`;

export const SEARCH_COMPANY_QUERY = gql`
  query SearchCompany(
    $where: CompanyWhereInput
    $limit: Int
    $orderBy: [CompanyOrderByWithRelationInput!]
  ) {
    searchResults: findManyCompany(
      where: $where
      take: $limit
      orderBy: $orderBy
    ) {
      ...CompanyFieldsFragment
    }
  }
`;

export const SEARCH_ACTIVITY_QUERY = gql`
  query SearchActivity(
    $where: ActivityWhereInput
    $limit: Int
    $orderBy: [ActivityOrderByWithRelationInput!]
  ) {
    searchResults: findManyActivities(
      where: $where
      take: $limit
      orderBy: $orderBy
    ) {
      id
      title
      body
    }
  }
`;
