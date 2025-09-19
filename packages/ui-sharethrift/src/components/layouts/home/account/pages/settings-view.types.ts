export interface SettingsUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  accountType: string;
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
  createdAt: string;
}

export interface SettingsViewProps {
  user: SettingsUser;
  onEditSection: (section: string) => void;
  onChangePassword: () => void;
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