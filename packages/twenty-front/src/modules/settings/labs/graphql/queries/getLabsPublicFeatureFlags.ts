import { gql } from '@apollo/client';

export const GET_LABS_PUBLIC_FEATURE_FLAGS = gql`
  query GetLabsPublicFeatureFlags {
    getLabsPublicFeatureFlags {
      id
      key
      value
      workspaceId
    }
  }
`;
