import type { Meta, StoryObj } from "@storybook/react";
import { SelectAccountType } from "../components/select-account-type.tsx";
import { MemoryRouter } from "react-router-dom";
import type { PersonalUserUpdateInput } from "../../../../generated.tsx";
// Mock data matching the GraphQL query shape
const mockUserData = {
  id: "mock-user-id-1",
  account: {
    accountType: "non-verified-personal",
  },
};

// Mock handler
const handleUpdateAccountType = (values: PersonalUserUpdateInput) => {
  console.log("Account type updated to:", values.account?.accountType);
};

const meta: Meta<typeof SelectAccountType> = {
  title: "Pages/Signup/SelectAccountType",
  component: SelectAccountType,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentUserData: mockUserData,
    onSaveAndContinue: handleUpdateAccountType,
  },
};
