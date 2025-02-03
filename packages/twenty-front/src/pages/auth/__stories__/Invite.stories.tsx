import { getOperationName } from '@apollo/client/utilities';
import { Meta, StoryObj } from '@storybook/react';
import { fireEvent, within } from '@storybook/test';
import { HttpResponse, graphql } from 'msw';

import { GET_CURRENT_USER } from '@/users/graphql/queries/getCurrentUser';
import { GET_WORKSPACE_FROM_INVITE_HASH } from '@/workspace/graphql/queries/getWorkspaceFromInviteHash';
import {
  PageDecorator,
  PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

import { AppPath } from '@/types/AppPath';
import { SignInUp } from '../SignInUp';
import { GET_PUBLIC_WORKSPACE_DATA_BY_SUBDOMAIN } from '@/auth/graphql/queries/getPublicWorkspaceDataBySubdomain';
import { mockedPublicWorkspaceDataBySubdomain } from '~/testing/mock-data/publicWorkspaceDataBySubdomain';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Auth/Invite',
  component: SignInUp,
  decorators: [PageDecorator],
  args: {
    routePath: AppPath.Invite,
    routeParams: { ':workspaceInviteHash': 'my-hash' },
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query(
          getOperationName(GET_PUBLIC_WORKSPACE_DATA_BY_SUBDOMAIN) ?? '',
          () => {
            return HttpResponse.json({
              data: {
                getPublicWorkspaceDataBySubdomain:
                  mockedPublicWorkspaceDataBySubdomain,
              },
            });
          },
        ),
        graphql.query(
          getOperationName(GET_WORKSPACE_FROM_INVITE_HASH) ?? '',
          () => {
            return HttpResponse.json({
              data: {
                findWorkspaceFromInviteHash: {
                  __typename: 'Workspace',
                  id: '20202020-91f0-46d0-acab-cb5afef3cc3b',
                  displayName: 'Twenty dev',
                  logo: null,
                  allowImpersonation: false,
                },
              },
            });
          },
        ),
        graphql.query(getOperationName(GET_CURRENT_USER) ?? '', () => {
          return HttpResponse.json({
            data: null,
            errors: [
              {
                message: 'Unauthorized',
                extensions: {
                  code: 'UNAUTHENTICATED',
                  response: {
                    statusCode: 401,
                    message: 'Unauthorized',
                  },
                },
              },
            ],
          });
        }),
        graphqlMocks.handlers,
      ],
    },
    cookie: '',
  },
};

export default meta;

export type Story = StoryObj<typeof SignInUp>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Join Twenty Eng team', undefined, {
      timeout: 5000,
    });

    const continueWithEmailButton = await canvas.findByText(
      'Continue With Email',
    );

    await fireEvent.click(continueWithEmailButton);
  },
};
