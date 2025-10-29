import { useQuery, useMutation } from "@apollo/client/react";
import { message } from "antd";
import React, { useState } from "react";
import { SettingsView } from "../pages/settings-view.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import type {
  CurrentUserSettingsQueryData,
  SettingsUser,
} from "./settings-view.types.ts";
import {
  HomeAccountSettingsViewContainerCurrentUserDocument,
  HomeAccountSettingsViewContainerUpdatePersonalUserDocument,
} from "../../../../../../generated.tsx";

function SettingsViewLoader() {
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<CurrentUserSettingsQueryData>(
    HomeAccountSettingsViewContainerCurrentUserDocument
  );

  const [updateUserMutation, { loading: updateLoading, error: updateError }] =
    useMutation(HomeAccountSettingsViewContainerUpdatePersonalUserDocument, {
      onError: (err) => {
        // eslint-disable-next-line no-console
        console.error("[SettingsView] update mutation error", err);
        const msg = err?.message || "Update failed";
        message.error(msg);
      },
    });

  const [isSavingSection, setIsSavingSection] = useState(false);

  const handleEditSection = () => {
    const currentPath = location.pathname;
    console.log("Current path:", currentPath);
    const newPath = currentPath.replace(/\/[^/]+$/, "/settings/edit");
    console.log("Navigating to:", newPath);
    // Navigate to edit page
    //navigate(newPath);
  };

  type EditableSection =
    | "profile"
    | "location"
    | "plan"
    | "billing"
    | "password";
  // Profile type alias for clarity
  type UserProfile = NonNullable<
    CurrentUserSettingsQueryData["currentPersonalUserAndCreateIfNotExists"]
  >["account"]["profile"];

  // Helper to construct the next profile given the section being edited
  const buildNextProfile = (
    section: EditableSection,
    values: Record<string, any>,
    base: UserProfile
  ): UserProfile => {
    const isProfile = section === "profile";
    const isLocation = section === "location";
    const isBilling = section === "billing";
    return {
      firstName: isProfile
        ? values["firstName"] ?? base.firstName
        : base.firstName,
      lastName: isProfile ? values["lastName"] ?? base.lastName : base.lastName,
      location: {
        address1: isLocation
          ? values["address1"] ?? base.location.address1 ?? ""
          : base.location.address1,
        address2: isLocation
          ? values["address2"] ?? base.location.address2 ?? ""
          : base.location.address2,
        city: isLocation
          ? values["city"] ?? base.location.city ?? ""
          : base.location.city,
        state: isLocation
          ? values["state"] ?? base.location.state ?? ""
          : base.location.state,
        country: isLocation
          ? values["country"] ?? base.location.country ?? ""
          : base.location.country,
        zipCode: isLocation
          ? values["zipCode"] ?? base.location.zipCode ?? ""
          : base.location.zipCode,
      },
      billing: {
        subscriptionId: isBilling
          ? values["subscriptionId"] ?? base.billing?.subscriptionId ?? ""
          : base.billing?.subscriptionId,
        cybersourceCustomerId: isBilling
          ? values["cybersourceCustomerId"] ??
            base.billing?.cybersourceCustomerId ??
            ""
          : base.billing?.cybersourceCustomerId,
      },
      ...(isProfile && { aboutMe: values["aboutMe"] ?? base.aboutMe }),
    };
  };
  const handleSaveSection = async (
    section: EditableSection,
    values: Record<string, any>
  ) => {
    if (!userData?.currentPersonalUserAndCreateIfNotExists) return;
    const user = userData.currentPersonalUserAndCreateIfNotExists;
    setIsSavingSection(true);
    if (updateLoading) {
      setIsSavingSection(false);
      return;
    }
    // Password change not implemented yet; short-circuit
    if (section === "password") {
      globalThis.alert?.("Password change is not implemented yet.");
      setIsSavingSection(false);
      return;
    }
    try {
      const base = user.account.profile;
      const nextProfile = buildNextProfile(section, values, base);
      const username =
        section === "profile"
          ? values["username"] ?? user.account.username
          : user.account.username;
      const accountType =
        section === "plan"
          ? values["accountType"] ?? user.account.accountType
          : user.account.accountType;

      const result = await updateUserMutation({
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

      if (!result.data?.personalUserUpdate) {
        throw new Error("Update failed");
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("[SettingsView] update mutation error", err);
      const msg = err?.message ?? "Update failed";
      message.error(msg);
      throw err; // propagate so view's save handler catch preserves edit mode
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleChangePassword = () => {
    // TODO: Implement password change logic - likely redirect to auth provider
    globalThis.alert?.("Password change functionality will be implemented");
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
    aboutMe: user.account.profile.aboutMe,
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
    password: user.account.password,
  };

  const errorMessage = userError ?? updateError;

  return (
    <ComponentQueryLoader
      loading={userLoading || updateLoading}
      error={errorMessage}
      hasData={userData}
      hasDataComponent={
        <SettingsView
          user={mappedUser}
          onEditSection={handleEditSection}
          onChangePassword={handleChangePassword}
          onSaveSection={handleSaveSection}
          isSavingSection={isSavingSection}
        />
      }
    />
  );
}

export const SettingsViewContainer: React.FC = () => <SettingsViewLoader />;
