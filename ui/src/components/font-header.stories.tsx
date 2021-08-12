import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Documentation/Core/Typography/Header',
} as Meta;

const Template: ComponentStory<any> = (args) => <div {...args} />;

export const H1 = Template.bind({});
H1.args = {
  children: <h1>H1</h1>
};
export const H2 = Template.bind({});
H2.args = {
  children: <h2>H2</h2>
};
export const H3 = Template.bind({});
H3.args = {
  children: <h3>H3</h3>
};
export const H4 = Template.bind({});
H4.args = {
  children: <h4>H4</h4>
};
export const H5 = Template.bind({});
H5.args = {
  children: <h5>H5</h5>
};
export const H6 = Template.bind({}); 
H6.args = {
  children: <h6>H6</h6>
};