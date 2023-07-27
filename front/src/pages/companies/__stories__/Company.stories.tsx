import { getOperationName } from '@apollo/client/utilities';
import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { fireEvent, within } from '@storybook/testing-library';
import { graphql } from 'msw';

import {
  GET_COMMENT_THREAD,
  GET_COMMENT_THREADS_BY_TARGETS,
} from '@/activities/queries';
import { CREATE_COMMENT_THREAD_WITH_COMMENT } from '@/activities/queries/create';
import { GET_COMPANY } from '@/companies/queries';
import {
  PageDecorator,
  type PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { mockedCommentThreads } from '~/testing/mock-data/comment-threads';
import { mockedCompaniesData } from '~/testing/mock-data/companies';

import { CompanyShow } from '../CompanyShow';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Companies/Company',
  component: CompanyShow,
  decorators: [PageDecorator],
  args: { currentPath: '/companies/89bb825c-171e-4bcc-9cf7-43448d6fb278' },
  parameters: {
    docs: { story: 'inline', iframeHeight: '500px' },
    msw: [
      ...graphqlMocks,
      graphql.query(
        getOperationName(GET_COMMENT_THREADS_BY_TARGETS) ?? '',
        (req, res, ctx) => {
          return res(
            ctx.data({
              findManyCommentThreads: mockedCommentThreads,
            }),
          );
        },
      ),
      graphql.query(getOperationName(GET_COMPANY) ?? '', (req, res, ctx) => {
        return res(
          ctx.data({
            findUniqueCompany: mockedCompaniesData[0],
          }),
        );
      }),
    ],
  },
};

export default meta;

export type Story = StoryObj<typeof CompanyShow>;

export const Default: Story = {};

export const EditNote: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstNoteTitle = await canvas.findByText('My very first note');
    await firstNoteTitle.click();

    expect(
      await canvas.findByDisplayValue('My very first note'),
    ).toBeInTheDocument();

    const workspaceName = await canvas.findByText('Twenty');
    await fireEvent.click(workspaceName);

    expect(await canvas.queryByDisplayValue('My very first note')).toBeNull();

    const noteButton = await canvas.findByText('Note');
    await noteButton.click();

    expect(
      await canvas.findByDisplayValue('My very first note'),
    ).toBeInTheDocument();
  },
  parameters: {
    msw: [
      ...meta.parameters?.msw,
      graphql.mutation(
        getOperationName(CREATE_COMMENT_THREAD_WITH_COMMENT) ?? '',
        (req, res, ctx) => {
          return res(
            ctx.data({
              createOneCommentThread: mockedCommentThreads[0],
            }),
          );
        },
      ),
      graphql.query(
        getOperationName(GET_COMMENT_THREAD) ?? '',
        (req, res, ctx) => {
          return res(
            ctx.data({
              findManyCommentThreads: [mockedCommentThreads[0]],
            }),
          );
        },
      ),
    ],
  },
};
