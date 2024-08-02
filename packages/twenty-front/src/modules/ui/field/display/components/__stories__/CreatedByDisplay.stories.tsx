import { Meta, StoryObj } from '@storybook/react';

import { ComponentWithRouterDecorator } from '~/testing/decorators/ComponentWithRouterDecorator';

import { CreatedByDisplay } from '@/ui/field/display/components/CreatedByDisplay';
import { CatalogDecorator } from 'twenty-ui';

const meta: Meta = {
  title: 'UI/Display/CreatedByDisplay',
  component: CreatedByDisplay,
  args: {
    name: 'John Doe',
  },
  decorators: [ComponentWithRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof CreatedByDisplay>;

export const Default: Story = {};

export const Catalog: Story = {
  decorators: [CatalogDecorator],
  parameters: {
    catalog: {
      dimensions: [
        {
          name: 'source',
          values: ['API', 'IMPORT', 'EMAIL', 'CALENDAR', 'MANUAL'],
          props: (source: string) => ({ source }),
        },
        {
          name: 'workspaceMemberId',
          values: [null, '123'],
          props: (workspaceMemberId: string) => ({ workspaceMemberId }),
        },
        {
          name: 'avatarUrl',
          values: [null, 'https://picsum.photos/16'],
          props: (avatarUrl: string) => ({ avatarUrl }),
        },
      ],
    },
  },
};
