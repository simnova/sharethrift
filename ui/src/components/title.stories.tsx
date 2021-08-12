import React from 'react';
import { ComponentStory, ComponentMeta} from '@storybook/react';
import { Title, TitleSize }  from './title';

export default {
  title: 'Documentation/Core/Typography/Title',
  component: Title,
  argTypes: {
    content : { control: 'text'}
  }
} as ComponentMeta<typeof Title>;
const Template: ComponentStory<typeof Title> = (args) => <Title {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default"
};

export const Title1 = Template.bind({});
Title1.args = {
  titleSize: TitleSize.Title1,
  children: "Title 1"
};

export const Title2 = Template.bind({});
Title2.args = {
  titleSize: TitleSize.Title2,
  children: "Title 2"
};

export const Title3 = Template.bind({});
Title3.args = {
  titleSize: TitleSize.Title3,
  children: "Title 3"
};