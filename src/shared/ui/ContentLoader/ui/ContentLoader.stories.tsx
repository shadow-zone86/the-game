import type { Meta, StoryObj } from '@storybook/react';
import { ContentLoader } from './ContentLoader';

const meta: Meta<typeof ContentLoader> = {
  title: 'Shared/ContentLoader',
  component: ContentLoader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Центрированный спиннер загрузки для использования в списках, карточках и т.д.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentLoader>;

export const Default: Story = {};

export const WithCustomClassName: Story = {
  args: {
    className: 'min-vh-50',
  },
};
