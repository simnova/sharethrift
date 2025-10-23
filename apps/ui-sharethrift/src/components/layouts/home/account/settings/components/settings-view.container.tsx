import { useQuery, useMutation } from "@apollo/client/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsView } from "../pages/settings-view.tsx";
import type {
  CurrentUserSettingsQueryData,
  SettingsUser,
} from "./settings-view.types.ts";
import {
  HomeAccountSettingsViewContainerCurrentUserDocument,
  HomeAccountSettingsEditContainerUpdatePersonalUserDocument,
} from "../../../../../../generated.tsx";

function SettingsViewLoader() {
  const navigate = useNavigate();
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<CurrentUserSettingsQueryData>(
    HomeAccountSettingsViewContainerCurrentUserDocument
  );
  const [updateUserMutation] = useMutation(
    HomeAccountSettingsEditContainerUpdatePersonalUserDocument
  );
  const [isSavingSection, setIsSavingSection] = useState(false);

  console.log("SettingsViewLoader userDaya:", userData);

  const handleEditSection = () => {
    const currentPath = location.pathname;
    console.log("Current path:", currentPath);
    const newPath = currentPath.replace(/\/[^/]+$/, "/settings/edit");
    console.log("Navigating to:", newPath);
    // Navigate to edit page
    //navigate(newPath);
  };

  const handleSaveSection = async (
    section: "profile" | "location" | "plan" | "billing" | "password" | string,
    values: Record<string, any>
  ) => {
    if (!userData?.currentPersonalUserAndCreateIfNotExists) return;
    const user = userData.currentPersonalUserAndCreateIfNotExists;
    setIsSavingSection(true);
    try {
      // Password change not implemented yet; short-circuit
      if (section === "password") {
        window.alert("Password change is not implemented yet.");
        return;
      }
      const base = user.account.profile;
      const nextProfile = {
        firstName:
          section === "profile"
            ? values.firstName ?? base.firstName
            : base.firstName,
        lastName:
          section === "profile"
            ? values.lastName ?? base.lastName
            : base.lastName,
        aboutMe:
          section === "profile"
            ? values.aboutMe ?? base.aboutMe ?? ""
            : base.aboutMe ?? "",
        location: {
          address1:
            section === "location"
              ? values.address1 ?? base.location.address1 ?? ""
              : base.location.address1,
          address2:
            section === "location"
              ? values.address2 ?? base.location.address2 ?? ""
              : base.location.address2,
          city:
            section === "location"
              ? values.city ?? base.location.city ?? ""
              : base.location.city,
          state:
            section === "location"
              ? values.state ?? base.location.state ?? ""
              : base.location.state,
          country:
            section === "location"
              ? values.country ?? base.location.country ?? ""
              : base.location.country,
          zipCode:
            section === "location"
              ? values.zipCode ?? base.location.zipCode ?? ""
              : base.location.zipCode,
        },
        billing:
          section === "billing"
            ? {
                subscriptionId:
                  values.subscriptionId ?? base.billing?.subscriptionId,
                cybersourceCustomerId:
                  values.cybersourceCustomerId ??
                  base.billing?.cybersourceCustomerId,
              }
            : base.billing,
      };
      const username =
        section === "profile"
          ? values.username ?? user.account.username
          : user.account.username;
      const accountType =
        section === "plan"
          ? values.accountType ?? user.account.accountType
          : user.account.accountType;
      await updateUserMutation({
        variables: {
          input: {
            id: user.id,
            account: {
              username,
              accountType,
              profile: nextProfile,
            },
          },
        },
        refetchQueries: [
          { query: HomeAccountSettingsViewContainerCurrentUserDocument },
        ],
      });
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleChangePassword = () => {
    // TODO: Implement password change logic - likely redirect to auth provider
    window.alert("Password change functionality will be implemented");
  };

  if (userError) {
    // When API is not available, show mock data for demonstration
    const mockUser: SettingsUser = {
      id: "mock-user-id",
      firstName: "Patrick",
      lastName: "Garcia",
      username: "patrick_g",
      email: "patrick.g@example.com",
      accountType: "personal",
      location: {
        address1: "123 Main Street",
        address2: "Apt 4B",
        city: "Philadelphia",
        state: "PA",
        country: "United States",
        zipCode: "19101",
      },
      billing: {
        subscriptionId: "sub_123456789",
        cybersourceCustomerId: "cust_abc123",
      },
      password: "sharethrift123",
      createdAt: new Date("2024-08-01").toISOString(),
    };

    return (
      <SettingsView
        user={mockUser}
        onEditSection={handleEditSection}
        onChangePassword={handleChangePassword}
      />
    );
  }

  if (userLoading) {
    return <div>Loading account settings...</div>;
  }

  if (!userData?.currentPersonalUserAndCreateIfNotExists) {
    return <div>User not found</div>;
  }

  const user = userData.currentPersonalUserAndCreateIfNotExists;

  const mappedUser: SettingsUser = {
    id: user.id,
    firstName: user.account.profile.firstName,
    lastName: user.account.profile.lastName,
    username: user.account.username,
    email: user.account.email,
    accountType: user.account.accountType,
    location: {
      address1: user.account.profile.location.address1,
      address2: user.account.profile.location.address2,
      city: user.account.profile.location.city,
      state: user.account.profile.location.state,
      country: user.account.profile.location.country,
      zipCode: user.account.profile.location.zipCode,
    },
    billing: user.account.profile.billing,
    createdAt: user.createdAt,
  };

  return (
    <SettingsView
      user={mappedUser}
      onEditSection={handleEditSection}
      onChangePassword={handleChangePassword}
      onSaveSection={handleSaveSection}
      isSavingSection={isSavingSection}
    />
  );
}

export const SettingsViewContainer: React.FC = () => <SettingsViewLoader />;
