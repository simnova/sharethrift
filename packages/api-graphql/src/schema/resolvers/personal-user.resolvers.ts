import type { GraphContext } from "../../context.ts";

interface PersonalUserCreateInput {
  userType: string;
  account: {
    accountType: string;
    email: string;
    username: string;
    profile: {
      firstName: string;
      lastName: string;
      location: {
        address1: string;
        address2?: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
      };
      billing?: {
        subscriptionId?: string;
        cybersourceCustomerId?: string;
      };
    };
  };
}

interface PersonalUserUpdateInput {
  userType?: string;
  isBlocked?: boolean;
  account?: {
    accountType?: string;
    email?: string;
    username?: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      location?: {
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
}

export const personalUserResolvers = {
  Query: {
    personalUser: (
      _parent: unknown, 
      { id }: { id: string }, 
      _context: GraphContext
    ) => {
      console.log('personalUser resolver called with id:', id);
      
      // For now, return mock data until persistence layer is fixed
      return {
        id,
        userType: 'personal',
        isBlocked: false,
        account: {
          accountType: 'personal',
          email: 'mock@example.com',
          username: 'mockuser',
          profile: {
            firstName: 'Mock',
            lastName: 'User',
            location: {
              address1: '123 Mock St',
              city: 'Mock City',
              state: 'MockState',
              country: 'MockCountry',
              zipCode: '12345'
            }
          }
        },
        schemaVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    personalUserByEmail: (
      _parent: unknown, 
      { email }: { email: string }, 
      _context: GraphContext
    ) => {
      console.log('personalUserByEmail resolver called with email:', email);
      
      return {
        id: 'mock-id-email',
        userType: 'personal',
        isBlocked: false,
        account: {
          accountType: 'personal',
          email,
          username: 'mockuser',
          profile: {
            firstName: 'Mock',
            lastName: 'User',
            location: {
              address1: '123 Mock St',
              city: 'Mock City',
              state: 'MockState',
              country: 'MockCountry',
              zipCode: '12345'
            }
          }
        },
        schemaVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    personalUserByUsername: (
      _parent: unknown, 
      { username }: { username: string }, 
      _context: GraphContext
    ) => {
      console.log('personalUserByUsername resolver called with username:', username);
      
      return {
        id: 'mock-id-username',
        userType: 'personal',
        isBlocked: false,
        account: {
          accountType: 'personal',
          email: 'mock@example.com',
          username,
          profile: {
            firstName: 'Mock',
            lastName: 'User',
            location: {
              address1: '123 Mock St',
              city: 'Mock City',
              state: 'MockState',
              country: 'MockCountry',
              zipCode: '12345'
            }
          }
        },
        schemaVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    personalUsers: (
      _parent: unknown, 
      { limit, offset }: { limit?: number; offset?: number }, 
      _context: GraphContext
    ) => {
      console.log('personalUsers resolver called with limit:', limit, 'offset:', offset);
      
      return [
        {
          id: 'mock-id-1',
          userType: 'personal',
          isBlocked: false,
          account: {
            accountType: 'personal',
            email: 'user1@example.com',
            username: 'user1',
            profile: {
              firstName: 'User',
              lastName: 'One',
              location: {
                address1: '123 Mock St',
                city: 'Mock City',
                state: 'MockState',
                country: 'MockCountry',
                zipCode: '12345'
              }
            }
          },
          schemaVersion: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    },
  },

  Mutation: {
    personalUserCreate: (
      _parent: unknown, 
      { input }: { input: PersonalUserCreateInput }, 
      _context: GraphContext
    ) => {
      console.log('personalUserCreate resolver called with input:', input);
      
      return {
        id: `mock-created-${Date.now()}`,
        userType: input.userType,
        isBlocked: false,
        account: input.account,
        schemaVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    personalUserUpdate: (
      _parent: unknown, 
      { id, input }: { id: string; input: PersonalUserUpdateInput }, 
      _context: GraphContext
    ) => {
      console.log('personalUserUpdate resolver called with id:', id, 'input:', input);
      
      return {
        id,
        userType: input.userType || 'personal',
        isBlocked: input.isBlocked || false,
        account: {
          accountType: input.account?.accountType || 'personal',
          email: input.account?.email || 'updated@example.com',
          username: input.account?.username || 'updateduser',
          profile: {
            firstName: input.account?.profile?.firstName || 'Updated',
            lastName: input.account?.profile?.lastName || 'User',
            location: {
              address1: input.account?.profile?.location?.address1 || '123 Updated St',
              address2: input.account?.profile?.location?.address2,
              city: input.account?.profile?.location?.city || 'Updated City',
              state: input.account?.profile?.location?.state || 'UpdatedState',
              country: input.account?.profile?.location?.country || 'UpdatedCountry',
              zipCode: input.account?.profile?.location?.zipCode || '54321'
            },
            billing: input.account?.profile?.billing
          }
        },
        schemaVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    personalUserBlock: (
      _parent: unknown, 
      { id }: { id: string }, 
      _context: GraphContext
    ) => {
      console.log('personalUserBlock resolver called with id:', id);
      
      return {
        id,
        userType: 'personal',
        isBlocked: true,
        account: {
          accountType: 'personal',
          email: 'blocked@example.com',
          username: 'blockeduser',
          profile: {
            firstName: 'Blocked',
            lastName: 'User',
            location: {
              address1: '123 Blocked St',
              city: 'Blocked City',
              state: 'BlockedState',
              country: 'BlockedCountry',
              zipCode: '99999'
            }
          }
        },
        schemaVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    personalUserUnblock: (
      _parent: unknown, 
      { id }: { id: string }, 
      _context: GraphContext
    ) => {
      console.log('personalUserUnblock resolver called with id:', id);
      
      return {
        id,
        userType: 'personal',
        isBlocked: false,
        account: {
          accountType: 'personal',
          email: 'unblocked@example.com',
          username: 'unblockeduser',
          profile: {
            firstName: 'Unblocked',
            lastName: 'User',
            location: {
              address1: '123 Unblocked St',
              city: 'Unblocked City',
              state: 'UnblockedState',
              country: 'UnblockedCountry',
              zipCode: '11111'
            }
          }
        },
        schemaVersion: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
  },
};