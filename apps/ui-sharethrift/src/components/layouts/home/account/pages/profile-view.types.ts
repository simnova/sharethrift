export interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  accountType: string;
  location: {
    city: string;
    state: string;
  };
  createdAt: string;
}

export interface UserListing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  state: string;
  images: string[];
  createdAt: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
}

// Apollo query result types
export interface CurrentUserQueryData {
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
          city: string;
          state: string;
        };
      };
    };
    createdAt: string;
  };
}

export interface UserListingsQueryData {
  itemListings: Array<UserListing & { sharer: string; updatedAt: string }>;
}
