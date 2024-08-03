import { COMPANY_LABEL_IDENTIFIER_FIELD_METADATA_ID } from '@/object-metadata/utils/getObjectMetadataItemsMock';
import { ViewField } from '@/views/types/ViewField';

export const SIGN_IN_BACKGROUND_MOCK_VIEW_FIELDS = [
  {
    __typename: 'ViewField',
    id: '5168be09-f200-40f5-9e04-29d607de06e5',
    fieldMetadataId: '20202020-7fbd-41ad-b64d-25a15ff62f04',
    size: 150,
    createdAt: '2023-11-23T15:38:03.706Z',
    viewId: '20202020-2441-4424-8163-4002c523d415',
    position: 4,
    isVisible: true,
    updatedAt: '2023-11-23T15:38:03.706Z',
  },
  {
    __typename: 'ViewField',
    id: '5ece850b-76fd-4135-9b99-06d49cad14ae',
    fieldMetadataId: '20202020-a61d-4b78-b998-3fd88b4f73a1',
    size: 170,
    createdAt: '2023-11-23T15:38:03.706Z',
    viewId: '20202020-2441-4424-8163-4002c523d415',
    position: 5,
    isVisible: true,
    updatedAt: '2023-11-23T15:38:03.706Z',
  },
  {
    __typename: 'ViewField',
    id: '604dbdbb-df01-4e47-921b-f9963109f912',
    fieldMetadataId: '20202020-0739-495d-8e70-c0807f6b2268',
    size: 150,
    createdAt: '2023-11-23T15:38:03.706Z',
    viewId: '20202020-2441-4424-8163-4002c523d415',
    position: 2,
    isVisible: true,
    updatedAt: '2023-11-23T15:38:03.706Z',
  },
  {
    __typename: 'ViewField',
    id: '7cbc36c8-37c6-4561-8c46-ddb316ddd121',
    fieldMetadataId: '20202020-4dc2-47c9-bb15-6e6f19ba9e46',
    size: 150,
    createdAt: '2023-11-23T15:38:03.706Z',
    viewId: '20202020-2441-4424-8163-4002c523d415',
    position: 3,
    isVisible: true,
    updatedAt: '2023-11-23T15:38:03.706Z',
  },
  {
    __typename: 'ViewField',
    id: 'a7d19be3-1ce9-479b-9453-2930a381e07c',
    fieldMetadataId: '20202020-5e4e-4007-a630-8a2617914889',
    size: 100,
    createdAt: '2023-11-23T15:38:03.706Z',
    viewId: '20202020-2441-4424-8163-4002c523d415',
    position: 1,
    isVisible: true,
    updatedAt: '2023-11-23T15:38:03.706Z',
  },
  {
    __typename: 'ViewField',
    id: 'cafacdc8-cbfc-4545-8242-94787f144ace',
    fieldMetadataId: COMPANY_LABEL_IDENTIFIER_FIELD_METADATA_ID,
    size: 180,
    createdAt: '2023-11-23T15:38:03.706Z',
    viewId: '20202020-2441-4424-8163-4002c523d415',
    position: 0,
    isVisible: true,
    updatedAt: '2023-11-23T15:38:03.706Z',
  },
  {
    __typename: 'ViewField',
    id: 'f0cc50c9-b9b6-405b-a1c0-23f7698ea731',
    fieldMetadataId: '20202020-ad10-4117-a039-3f04b7a5f939',
    size: 170,
    createdAt: '2023-11-23T15:38:03.706Z',
    viewId: '20202020-2441-4424-8163-4002c523d415',
    position: 6,
    isVisible: true,
    updatedAt: '2023-11-23T15:38:03.706Z',
  },
] as (ViewField & {
  __typename: string;
  createdAt: string;
  viewId: string;
  updatedAt: string;
})[];
