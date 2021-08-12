import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Documentation/Core/Typography/Body',
} as Meta;

const Template: ComponentStory<any> = (args) => <div {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default'
};

export const SemiBold = Template.bind({});
SemiBold.args = {
  className: 'semi-bold',
  children: 'Semi Bold'
};

export const Bold = Template.bind({});
Bold.args = {
  className: 'bold',
  children: 'Bold'
};

