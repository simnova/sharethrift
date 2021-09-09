import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date is required to enable the use of  Date objects in the database. Do not remove othwerwise you will get an error. */
  Date: any;
};

export type Category = {
  __typename?: "Category";
  _id: Scalars["ID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  path?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
};

export type CreateUserInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
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
  _empty?: Maybe<Scalars["String"]>;
  getCategories?: Maybe<Array<Maybe<Category>>>;
  getUser?: Maybe<User>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryGetUserArgs = {
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  _id: Scalars["ID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
};

export type UserUpdateInput = {
  id: Scalars["ID"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type CategoryFieldsFragment = {
  __typename?: "Category";
  _id: string;
  schemaVersion?: Maybe<string>;
  name?: Maybe<string>;
  path?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
};

export type UserFieldsFragment = {
  __typename?: "User";
  _id: string;
  schemaVersion?: Maybe<string>;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  email?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
};

export type UserMinimalFieldsFragment = {
  __typename?: "User";
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
};

export type UpdateUserMutationVariables = Exact<{
  input: UserUpdateInput;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser?: Maybe<{
    __typename?: "User";
    _id: string;
    schemaVersion?: Maybe<string>;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    email?: Maybe<string>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
  }>;
};

export type GetUserQueryVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type GetUserQuery = {
  __typename?: "Query";
  getUser?: Maybe<{
    __typename?: "User";
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
  }>;
};

export const CategoryFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CategoryFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Category" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "path" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CategoryFieldsFragment, unknown>;
export const UserFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "_id" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
          { kind: "Field", name: { kind: "Name", value: "firstName" } },
          { kind: "Field", name: { kind: "Name", value: "lastName" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const UserMinimalFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserMinimalFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "firstName" } },
          { kind: "Field", name: { kind: "Name", value: "lastName" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserMinimalFieldsFragment, unknown>;
export const UpdateUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "updateUser" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UserUpdateInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateUser" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "UserFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getUser" },
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
            name: { kind: "Name", value: "getUser" },
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
                  name: { kind: "Name", value: "UserMinimalFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserMinimalFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
