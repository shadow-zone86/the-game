import type { Meta, StoryObj } from '@storybook/react';
import { PageLoader } from './PageLoader';

const meta: Meta<typeof PageLoader> = {
  title: 'Shared/PageLoader',
  component: PageLoader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Полноэкранный лоадер при загрузке страницы. Скрывается после события load или по таймауту.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Default: Story = {};
