import type { Meta, StoryObj } from '@storybook/react';
import { PageLoader } from './PageLoader';

const meta: Meta<typeof PageLoader> = {
  title: 'Shared/PageLoader',
  component: PageLoader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Default: Story = {};
