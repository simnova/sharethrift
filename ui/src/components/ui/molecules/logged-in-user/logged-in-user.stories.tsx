import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { ComponentStory } from '@storybook/react';

import { LoggedInUser } from './';

export default {
  title: 'UI/Molecules/LoggedInUser',
} as Meta;

const Template: ComponentStory<typeof LoggedInUser> = (args) => <LoggedInUser {...args} />;

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  data: {
    isLoggedIn: false,
  }
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  data: {
    isLoggedIn: true,
    firstName: 'John',
    lastName: 'Doe',
    notificationCount: 0,
  }
};