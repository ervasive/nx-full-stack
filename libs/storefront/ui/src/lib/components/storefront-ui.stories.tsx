import type { Meta, StoryObj } from '@storybook/react';
import { StorefrontUi } from './storefront-ui';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<typeof StorefrontUi> = {
  component: StorefrontUi,
  title: 'StorefrontUi',
};
export default meta;
type Story = StoryObj<typeof StorefrontUi>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to StorefrontUi!/gi)).toBeTruthy();
  },
};
