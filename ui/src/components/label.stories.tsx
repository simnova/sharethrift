import React from 'react';
import { ComponentStory, ComponentMeta} from '@storybook/react';
import { Label, LabelType }  from './label';

export default {
  title: 'Components/Label',
  component: Label,
  argTypes: {
    content : { control: 'text'}
  }
} as ComponentMeta<typeof Label>;
const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default"
};

export const RequestSubmitted = Template.bind({});
RequestSubmitted.args = {
  labelType: LabelType.RequestSubmitted,
  children: "Request Submitted"
};

export const ListingDraft = Template.bind({});
ListingDraft.args = {
  labelType: LabelType.ListingDraft,
  children: "Listing Draft"
};

export const RequestAccepted = Template.bind({});
RequestAccepted.args = {
  labelType: LabelType.RequestAccepted,
  children: "Request Accepted"
};

export const PickupArranged = Template.bind({});
PickupArranged.args = {
  labelType: LabelType.PickupArranged,
  children: "Pickup Arranged"
};

export const ReturnPending = Template.bind({});
ReturnPending.args = {
  labelType: LabelType.ReturnPending,
  children: "Return Pending"
};

export const ListingSubmitted = Template.bind({});
ListingSubmitted.args = {
  labelType: LabelType.ListingSubmitted,
  children: "Listing Submitted"
};

export const ListingPosted = Template.bind({});
ListingPosted.args = {
  labelType: LabelType.ListingPosted,
  children: "Listing Posted"
};

export const ListingPaused = Template.bind({});
ListingPaused.args = {
  labelType: LabelType.ListingPaused,
  children: "Listing Paused"
};

export const UpdateNeeded = Template.bind({});
UpdateNeeded.args = {
  labelType: LabelType.UpdateNeeded,
  children: "Update Needed"
};

export const RequestReceived = Template.bind({});
RequestReceived.args = {
  labelType: LabelType.RequestReceived,
  children: "Request Received"
};

export const RequestComplete = Template.bind({});
RequestComplete.args = {
  labelType: LabelType.RequestComplete,
  children: "Request Complete"
};