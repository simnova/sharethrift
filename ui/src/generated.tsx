import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
  Byte: any;
  Currency: any;
  Date: any;
  DateTime: any;
  Duration: any;
  EmailAddress: any;
  GUID: any;
  HSL: any;
  HSLA: any;
  HexColorCode: any;
  Hexadecimal: any;
  IBAN: any;
  IPv4: any;
  IPv6: any;
  ISBN: any;
  ISO8601Duration: any;
  JSON: any;
  JSONObject: any;
  JWT: any;
  Latitude: any;
  LocalDate: any;
  LocalEndTime: any;
  LocalTime: any;
  Long: any;
  Longitude: any;
  MAC: any;
  NegativeFloat: any;
  NegativeInt: any;
  NonEmptyString: any;
  NonNegativeFloat: any;
  NonNegativeInt: any;
  NonPositiveFloat: any;
  NonPositiveInt: any;
  ObjectID: any;
  PhoneNumber: any;
  Port: any;
  PositiveFloat: any;
  PositiveInt: any;
  PostalCode: any;
  RGB: any;
  RGBA: any;
  SafeInt: any;
  Time: any;
  Timestamp: any;
  URL: any;
  USCurrency: any;
  UUID: any;
  UnsignedFloat: any;
  UnsignedInt: any;
  UtcOffset: any;
  Void: any;
};

export type Category = MongoBase & {
  __typename?: "Category";
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  parentId?: Maybe<Category>;
  childrenIds?: Maybe<Array<Maybe<Category>>>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type CategoryDetail = {
  name?: Maybe<Scalars["String"]>;
};

/**  New user values  */
export type CreateUserInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  /** Must be a valid email address */
  email?: Maybe<Scalars["EmailAddress"]>;
};

/** Base type for all models in mongo. */
export type MongoBase = {
  /** The ID of the object. */
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  /** Automatically generated timestamp, updated on every save. */
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type Mutation = {
  __typename?: "Mutation";
  /** IGNORE: Dummy field necessary for the Mutation type to be valid */
  _empty?: Maybe<Scalars["String"]>;
  createCategory?: Maybe<Category>;
  createUser?: Maybe<User>;
  /** Allows the user to update their profile */
  updateUser?: Maybe<User>;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCreateCategoryArgs = {
  category: CategoryDetail;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type Query = {
  __typename?: "Query";
  /** IGNORE: Dummy field necessary for the Query type to be valid */
  _empty?: Maybe<Scalars["String"]>;
  categories?: Maybe<Array<Maybe<Category>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type User = MongoBase & {
  __typename?: "User";
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["EmailAddress"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type UserUpdateInput = {
  id: Scalars["ObjectID"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type CategoryCreateMutationVariables = Exact<{
  category: CategoryDetail;
}>;

export type CategoryCreateMutation = {
  __typename?: "Mutation";
  createCategory?: Maybe<{ __typename?: "Category"; name?: Maybe<string> }>;
};

export type UserListItemFieldsFragment = {
  __typename?: "User";
  id: any;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
};

export type UserListGetUsersQueryVariables = Exact<{ [key: string]: never }>;

export type UserListGetUsersQuery = {
  __typename?: "Query";
  users?: Maybe<
    Array<
      Maybe<{
        __typename?: "User";
        id: any;
        firstName?: Maybe<string>;
        lastName?: Maybe<string>;
      }>
    >
  >;
};

export type UserListGetUsersFieldsFragment = { __typename?: "User"; id: any };

export type UserProfileDetailQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type UserProfileDetailQuery = {
  __typename?: "Query";
  user?: Maybe<{
    __typename?: "User";
    id: any;
    firstName?: Maybe<string>;
    email?: Maybe<any>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
  }>;
};

export type UserProfileDetailFieldsFragment = {
  __typename?: "User";
  id: any;
  firstName?: Maybe<string>;
  email?: Maybe<any>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
};

export type UserProfileQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type UserProfileQuery = {
  __typename?: "Query";
  user?: Maybe<{
    __typename?: "User";
    id: any;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
  }>;
};

export type UserProfileFieldsFragment = {
  __typename?: "User";
  id: any;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
};

export const UserListItemFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserListItemFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "firstName" } },
          { kind: "Field", name: { kind: "Name", value: "lastName" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserListItemFieldsFragment, unknown>;
export const UserListGetUsersFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserListGetUsersFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
      },
    },
  ],
} as unknown as DocumentNode<UserListGetUsersFieldsFragment, unknown>;
export const UserProfileDetailFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserProfileDetailFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "firstName" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserProfileDetailFieldsFragment, unknown>;
export const UserProfileFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserProfileFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "firstName" } },
          { kind: "Field", name: { kind: "Name", value: "lastName" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserProfileFieldsFragment, unknown>;
export const CategoryCreateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CategoryCreate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "category" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CategoryDetail" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createCategory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "category" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "category" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CategoryCreateMutation,
  CategoryCreateMutationVariables
>;
export const UserListGetUsersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserListGetUsers" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "users" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserListItemFields" },
                },
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserListGetUsersFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserListItemFieldsFragmentDoc.definitions,
    ...UserListGetUsersFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UserListGetUsersQuery,
  UserListGetUsersQueryVariables
>;
export const UserProfileDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserProfileDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserProfileDetailFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserProfileDetailFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  UserProfileDetailQuery,
  UserProfileDetailQueryVariables
>;
export const UserProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserProfile" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserProfileFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserProfileFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<UserProfileQuery, UserProfileQueryVariables>;
