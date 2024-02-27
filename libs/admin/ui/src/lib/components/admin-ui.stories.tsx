import type { Meta, StoryObj } from '@storybook/react';
import { AdminUi } from './admin-ui';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<typeof AdminUi> = {
  component: AdminUi,
  title: 'AdminUi',
};
export default meta;
type Story = StoryObj<typeof AdminUi>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to AdminUi!/gi)).toBeTruthy();
  },
};
