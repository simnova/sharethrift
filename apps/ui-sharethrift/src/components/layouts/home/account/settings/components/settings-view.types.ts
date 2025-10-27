export interface SettingsUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  accountType: string;
  aboutMe?: string;
  location: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  billing?: {
    subscriptionId?: string;
    cybersourceCustomerId?: string;
  };
  password: string;
  createdAt: string;
}

export interface SettingsViewProps {
  user: SettingsUser;
  onEditSection: (section: string) => void;
  onChangePassword: () => void;

  onSaveSection?: (section: string, values: any) => Promise<void>;
  isSavingSection?: boolean;
  mutationErrorMessage?: string;
}

export interface SettingsEditProps {
  user: SettingsUser;
  onSave: (values: SettingsUser) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
  isLoading?: boolean;
}

export interface CurrentUserSettingsQueryData {
  currentPersonalUserAndCreateIfNotExists: {
    id: string;
    userType: string;
    account: {
      accountType: string;
      email: string;
      username: string;
      profile: {
        firstName: string;
        lastName: string;
        aboutMe?: string;
        location: {
          address1?: string;
          address2?: string;
          city?: string;
          state?: string;
          country?: string;
          zipCode?: string;
        };
        billing?: {
          subscriptionId?: string;
          cybersourceCustomerId?: string;
        };
      };
      password: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface PlanOption {
  id: string;
  name: string;
  price: string;
  features: string[];
  isSelected: boolean;
  isPopular?: boolean;
}