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

export type Account = MongoBase & {
  __typename?: "Account";
  name?: Maybe<Scalars["String"]>;
  handle?: Maybe<Scalars["String"]>;
  roles?: Maybe<Array<Maybe<Role>>>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
};

export type AccountPermissions = {
  __typename?: "AccountPermissions";
  canManageRolesAndPermissions: Scalars["Boolean"];
  canManageAccountSettings: Scalars["Boolean"];
};

export type AccountPermissionsInput = {
  canManageRolesAndPermissions: Scalars["Boolean"];
  canManageAccountSettings: Scalars["Boolean"];
};

export type AccountUpdateInput = {
  id: Scalars["ObjectID"];
  name?: Maybe<Scalars["String"]>;
  handle?: Maybe<Scalars["String"]>;
};

export type Address = {
  __typename?: "Address";
  streetNumber?: Maybe<Scalars["String"]>;
  streetName?: Maybe<Scalars["String"]>;
  municipality?: Maybe<Scalars["String"]>;
  municipalitySubdivision?: Maybe<Scalars["String"]>;
  countrySecondarySubdivision?: Maybe<Scalars["String"]>;
  countryTertiarySubdivision?: Maybe<Scalars["String"]>;
  countrySubdivision?: Maybe<Scalars["String"]>;
  countrySubdivisionName?: Maybe<Scalars["String"]>;
  postalCode?: Maybe<Scalars["String"]>;
  extendedPostalCode?: Maybe<Scalars["String"]>;
  countryCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  countryCodeISO3?: Maybe<Scalars["String"]>;
  freeformAddress?: Maybe<Scalars["String"]>;
};

/**  Required to enable Apollo Cache Control  */
export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

export type Category = MongoBase & {
  __typename?: "Category";
  name?: Maybe<Scalars["String"]>;
  parentId?: Maybe<Category>;
  childrenIds?: Maybe<Array<Maybe<Category>>>;
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type CategoryDetail = {
  parentId?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
};

export type Contact = {
  __typename?: "Contact";
  firstName: Scalars["String"];
  lastName?: Maybe<Scalars["String"]>;
  role?: Maybe<Role>;
  user?: Maybe<User>;
  id: Scalars["ObjectID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
};

export type CreateListingPayload = {
  __typename?: "CreateListingPayload";
  listing?: Maybe<Listing>;
};

export type Draft = {
  __typename?: "Draft";
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  photos?: Maybe<Array<Maybe<Photo>>>;
  primaryCategory?: Maybe<Category>;
  statusHistory?: Maybe<Array<Maybe<DraftStatus>>>;
};

export type DraftAuthHeaderForDraftPhotoOutput = {
  __typename?: "DraftAuthHeaderForDraftPhotoOutput";
  authHeader?: Maybe<Scalars["String"]>;
  blobName?: Maybe<Scalars["String"]>;
  requestDate?: Maybe<Scalars["String"]>;
  isAuthorized?: Maybe<Scalars["Boolean"]>;
  errorMessage?: Maybe<Scalars["String"]>;
};

export type DraftPhotoImageInput = {
  listingId?: Maybe<Scalars["String"]>;
  order?: Maybe<Scalars["Int"]>;
  contentType?: Maybe<Scalars["String"]>;
  contentLength?: Maybe<Scalars["Int"]>;
};

export type DraftRemovePhotoImageInput = {
  listingId: Scalars["ID"];
  order: Scalars["Int"];
};

export type DraftRemovePhotoResult = {
  __typename?: "DraftRemovePhotoResult";
  success: Scalars["Boolean"];
  errorMessage?: Maybe<Scalars["String"]>;
};

export type DraftStatus = {
  __typename?: "DraftStatus";
  id: Scalars["ObjectID"];
  statusCode?: Maybe<Scalars["String"]>;
  statusDetail?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
};

export type FacetDetail = {
  __typename?: "FacetDetail";
  value?: Maybe<Scalars["String"]>;
  count?: Maybe<Scalars["Int"]>;
};

/**  https://www.apollographql.com/blog/graphql/basics/designing-graphql-mutations/  */
export type Listing = MongoBase & {
  __typename?: "Listing";
  account?: Maybe<Account>;
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  statusCode?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  primaryCategory?: Maybe<Category>;
  photos?: Maybe<Array<Maybe<Photo>>>;
  location?: Maybe<Location>;
  draft?: Maybe<Draft>;
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
};

export type ListingDetail = {
  id?: Maybe<Scalars["ObjectID"]>;
  account?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  primaryCategory?: Maybe<Scalars["ObjectID"]>;
};

export type ListingDraft = {
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  primaryCategory?: Maybe<Scalars["ObjectID"]>;
};

export type ListingNewDraft = {
  accountHandle: Scalars["String"];
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  primaryCategory?: Maybe<Scalars["ObjectID"]>;
};

export type ListingPermissions = {
  __typename?: "ListingPermissions";
  canManageListings: Scalars["Boolean"];
};

export type ListingPermissionsInput = {
  canManageListings: Scalars["Boolean"];
};

export type ListingSearchFacets = {
  __typename?: "ListingSearchFacets";
  tags?: Maybe<Array<Maybe<FacetDetail>>>;
  primaryCategory?: Maybe<Array<Maybe<FacetDetail>>>;
};

export type ListingSearchInput = {
  searchString?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  category?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  skip?: Maybe<Scalars["Int"]>;
};

export type ListingSearchResult = {
  __typename?: "ListingSearchResult";
  listingResults?: Maybe<Array<Maybe<Listing>>>;
  total?: Maybe<Scalars["Int"]>;
  facets?: Maybe<ListingSearchFacets>;
};

export type Location = MongoBase & {
  __typename?: "Location";
  position?: Maybe<Point>;
  address?: Maybe<Address>;
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
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
  accountAddRole?: Maybe<Account>;
  accountUpdateRole?: Maybe<Account>;
  createCategory?: Maybe<Category>;
  createNewListing?: Maybe<CreateListingPayload>;
  createUser?: Maybe<User>;
  draftAddPhoto: DraftAuthHeaderForDraftPhotoOutput;
  draftRemovePhoto: DraftRemovePhotoResult;
  listingDraftCreate?: Maybe<Scalars["ID"]>;
  listingDraftPublish?: Maybe<Scalars["ID"]>;
  listingUnpublish?: Maybe<Scalars["ID"]>;
  updateAccount?: Maybe<Account>;
  updateCategory?: Maybe<Category>;
  updateDraft?: Maybe<Listing>;
  /** Allows the user to update their profile */
  updateUser?: Maybe<User>;
  userCreateAuthHeaderForProfilePhoto: UserCreateAuthHeaderForProfilePhotoOutput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationAccountAddRoleArgs = {
  input: RoleAddInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationAccountUpdateRoleArgs = {
  input: RoleUpdateInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCreateCategoryArgs = {
  category: CategoryDetail;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCreateNewListingArgs = {
  input: ListingNewDraft;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationDraftAddPhotoArgs = {
  input: DraftPhotoImageInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationDraftRemovePhotoArgs = {
  input: DraftRemovePhotoImageInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationListingDraftCreateArgs = {
  id: Scalars["ID"];
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationListingDraftPublishArgs = {
  id: Scalars["ID"];
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationListingUnpublishArgs = {
  id: Scalars["ID"];
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationUpdateAccountArgs = {
  input: AccountUpdateInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationUpdateCategoryArgs = {
  category: UpdateCategory;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationUpdateDraftArgs = {
  input: ListingDraft;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationUserCreateAuthHeaderForProfilePhotoArgs = {
  input: UserProfilePhotoImageInput;
};

export type Permissions = {
  __typename?: "Permissions";
  listingPermissions: ListingPermissions;
  accountPermissions: AccountPermissions;
};

export type PermissionsInput = {
  listingPermissions: ListingPermissionsInput;
  accountPermissions: AccountPermissionsInput;
};

export type Photo = {
  __typename?: "Photo";
  id: Scalars["ObjectID"];
  order?: Maybe<Scalars["Int"]>;
  documentId?: Maybe<Scalars["String"]>;
};

export type Point = MongoBase & {
  __typename?: "Point";
  type?: Maybe<Scalars["String"]>;
  coordinates?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type Query = {
  __typename?: "Query";
  /** IGNORE: Dummy field necessary for the Query type to be valid */
  _empty?: Maybe<Scalars["String"]>;
  account?: Maybe<Account>;
  accountGetByHandle?: Maybe<Account>;
  accounts?: Maybe<Array<Maybe<Account>>>;
  categories?: Maybe<Array<Maybe<Category>>>;
  category?: Maybe<Category>;
  currentUser?: Maybe<User>;
  listing?: Maybe<Listing>;
  listingSearch?: Maybe<ListingSearchResult>;
  listings?: Maybe<Array<Maybe<Listing>>>;
  listingsByAccountHandle?: Maybe<Array<Maybe<Listing>>>;
  listingsForAccount?: Maybe<Array<Maybe<Listing>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryAccountArgs = {
  id: Scalars["ID"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryAccountGetByHandleArgs = {
  handle: Scalars["String"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryCategoryArgs = {
  id: Scalars["ID"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryListingArgs = {
  id: Scalars["ID"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryListingSearchArgs = {
  input: ListingSearchInput;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryListingsByAccountHandleArgs = {
  handle: Scalars["String"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryListingsForAccountArgs = {
  accountId: Scalars["ID"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type Role = {
  __typename?: "Role";
  roleName: Scalars["String"];
  isDefault: Scalars["Boolean"];
  permissions: Permissions;
  id: Scalars["ObjectID"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
};

export type RoleAddInput = {
  accountHandle: Scalars["String"];
  roleName: Scalars["String"];
  permissions: PermissionsInput;
};

export type RoleUpdateInput = {
  accountHandle: Scalars["String"];
  id: Scalars["ObjectID"];
  roleName: Scalars["String"];
  permissions: PermissionsInput;
};

export type UpdateCategory = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

export type User = MongoBase & {
  __typename?: "User";
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["EmailAddress"]>;
  externalId?: Maybe<Scalars["String"]>;
  id: Scalars["ObjectID"];
  schemaVersion?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type UserCreateAuthHeaderForProfilePhotoOutput = {
  __typename?: "UserCreateAuthHeaderForProfilePhotoOutput";
  authHeader?: Maybe<Scalars["String"]>;
  blobName?: Maybe<Scalars["String"]>;
  requestDate?: Maybe<Scalars["String"]>;
  isAuthorized?: Maybe<Scalars["Boolean"]>;
  errorMessage?: Maybe<Scalars["String"]>;
};

export type UserProfilePhotoImageInput = {
  contentType?: Maybe<Scalars["String"]>;
  contentLength?: Maybe<Scalars["Int"]>;
};

export type UserUpdateInput = {
  id: Scalars["ObjectID"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export type AccountSelectionAccountsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type AccountSelectionAccountsQuery = {
  __typename?: "Query";
  accounts?: Maybe<
    Array<
      Maybe<{
        __typename?: "Account";
        id: any;
        schemaVersion?: Maybe<string>;
        createdAt?: Maybe<any>;
        updatedAt?: Maybe<any>;
        name?: Maybe<string>;
      }>
    >
  >;
};

export type AccountSelectionAccountFieldsFragment = {
  __typename?: "Account";
  id: any;
  schemaVersion?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  name?: Maybe<string>;
};

export type CategoryCreateMutationVariables = Exact<{
  category: CategoryDetail;
}>;

export type CategoryCreateMutation = {
  __typename?: "Mutation";
  createCategory?: Maybe<{ __typename?: "Category"; name?: Maybe<string> }>;
};

export type CategorySelectionCategoriesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type CategorySelectionCategoriesQuery = {
  __typename?: "Query";
  categories?: Maybe<
    Array<
      Maybe<{
        __typename?: "Category";
        id: any;
        schemaVersion?: Maybe<string>;
        createdAt?: Maybe<any>;
        updatedAt?: Maybe<any>;
        name?: Maybe<string>;
      }>
    >
  >;
};

export type CategorySelectionCategoryFieldsFragment = {
  __typename?: "Category";
  id: any;
  schemaVersion?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  name?: Maybe<string>;
};

export type AccountMenuAccountsQueryVariables = Exact<{ [key: string]: never }>;

export type AccountMenuAccountsQuery = {
  __typename?: "Query";
  accounts?: Maybe<
    Array<
      Maybe<{
        __typename?: "Account";
        id: any;
        schemaVersion?: Maybe<string>;
        createdAt?: Maybe<any>;
        updatedAt?: Maybe<any>;
        handle?: Maybe<string>;
        name?: Maybe<string>;
      }>
    >
  >;
};

export type AccountMenuAccountFieldsFragment = {
  __typename?: "Account";
  id: any;
  schemaVersion?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  handle?: Maybe<string>;
  name?: Maybe<string>;
};

export type AccountSettingsContactsContainerAccountGetByHandleQueryVariables =
  Exact<{
    handle: Scalars["String"];
  }>;

export type AccountSettingsContactsContainerAccountGetByHandleQuery = {
  __typename?: "Query";
  accountGetByHandle?: Maybe<{
    __typename?: "Account";
    id: any;
    schemaVersion?: Maybe<string>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
    handle?: Maybe<string>;
    name?: Maybe<string>;
    contacts?: Maybe<
      Array<
        Maybe<{
          __typename?: "Contact";
          firstName: string;
          lastName?: Maybe<string>;
          id: any;
          updatedAt?: Maybe<any>;
          createdAt?: Maybe<any>;
          role?: Maybe<{ __typename?: "Role"; id: any; roleName: string }>;
          user?: Maybe<{ __typename?: "User"; id: any }>;
        }>
      >
    >;
  }>;
};

export type AccountSettingsContactsContainerAccountGetByHandleFieldsFragment = {
  __typename?: "Account";
  id: any;
  schemaVersion?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  handle?: Maybe<string>;
  name?: Maybe<string>;
  contacts?: Maybe<
    Array<
      Maybe<{
        __typename?: "Contact";
        firstName: string;
        lastName?: Maybe<string>;
        id: any;
        updatedAt?: Maybe<any>;
        createdAt?: Maybe<any>;
        role?: Maybe<{ __typename?: "Role"; id: any; roleName: string }>;
        user?: Maybe<{ __typename?: "User"; id: any }>;
      }>
    >
  >;
};

export type AccountSettingsGeneralContainerAccountGetByHandleQueryVariables =
  Exact<{
    handle: Scalars["String"];
  }>;

export type AccountSettingsGeneralContainerAccountGetByHandleQuery = {
  __typename?: "Query";
  accountGetByHandle?: Maybe<{
    __typename?: "Account";
    id: any;
    schemaVersion?: Maybe<string>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
    handle?: Maybe<string>;
    name?: Maybe<string>;
  }>;
};

export type AccountSettingsGeneralContainerUpdateAccountMutationVariables =
  Exact<{
    input: AccountUpdateInput;
  }>;

export type AccountSettingsGeneralContainerUpdateAccountMutation = {
  __typename?: "Mutation";
  updateAccount?: Maybe<{
    __typename?: "Account";
    id: any;
    schemaVersion?: Maybe<string>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
    handle?: Maybe<string>;
    name?: Maybe<string>;
  }>;
};

export type AccountSettingsGeneralContainerAccountFieldsFragment = {
  __typename?: "Account";
  id: any;
  schemaVersion?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  handle?: Maybe<string>;
  name?: Maybe<string>;
};

export type AccountSettingsRolesContainerAccountGetByHandleQueryVariables =
  Exact<{
    handle: Scalars["String"];
  }>;

export type AccountSettingsRolesContainerAccountGetByHandleQuery = {
  __typename?: "Query";
  accountGetByHandle?: Maybe<{
    __typename?: "Account";
    id: any;
    schemaVersion?: Maybe<string>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
    handle?: Maybe<string>;
    name?: Maybe<string>;
    roles?: Maybe<
      Array<
        Maybe<{
          __typename?: "Role";
          id: any;
          roleName: string;
          isDefault: boolean;
          permissions: {
            __typename?: "Permissions";
            listingPermissions: {
              __typename?: "ListingPermissions";
              canManageListings: boolean;
            };
            accountPermissions: {
              __typename?: "AccountPermissions";
              canManageRolesAndPermissions: boolean;
              canManageAccountSettings: boolean;
            };
          };
        }>
      >
    >;
  }>;
};

export type AccountSettingsRolesContainerAccountAddRoleMutationVariables =
  Exact<{
    input: RoleAddInput;
  }>;

export type AccountSettingsRolesContainerAccountAddRoleMutation = {
  __typename?: "Mutation";
  accountAddRole?: Maybe<{ __typename?: "Account"; id: any }>;
};

export type AccountSettingsRolesContainerAccountUpdateRoleMutationVariables =
  Exact<{
    input: RoleUpdateInput;
  }>;

export type AccountSettingsRolesContainerAccountUpdateRoleMutation = {
  __typename?: "Mutation";
  accountUpdateRole?: Maybe<{ __typename?: "Account"; id: any }>;
};

export type AccountSettingsRolesContainerAccountGetByHandleFieldsFragment = {
  __typename?: "Account";
  id: any;
  schemaVersion?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  handle?: Maybe<string>;
  name?: Maybe<string>;
  roles?: Maybe<
    Array<
      Maybe<{
        __typename?: "Role";
        id: any;
        roleName: string;
        isDefault: boolean;
        permissions: {
          __typename?: "Permissions";
          listingPermissions: {
            __typename?: "ListingPermissions";
            canManageListings: boolean;
          };
          accountPermissions: {
            __typename?: "AccountPermissions";
            canManageRolesAndPermissions: boolean;
            canManageAccountSettings: boolean;
          };
        };
      }>
    >
  >;
};

export type ListingCategorySelectionContainerCategoriesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ListingCategorySelectionContainerCategoriesQuery = {
  __typename?: "Query";
  categories?: Maybe<
    Array<
      Maybe<{
        __typename?: "Category";
        id: any;
        schemaVersion?: Maybe<string>;
        createdAt?: Maybe<any>;
        updatedAt?: Maybe<any>;
        name?: Maybe<string>;
      }>
    >
  >;
};

export type ListingCategorySelectionContainerFieldsFragment = {
  __typename?: "Category";
  id: any;
  schemaVersion?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  name?: Maybe<string>;
  parentId?: Maybe<{ __typename?: "Category"; id: any }>;
};

export type ListingCreateContainerCreateListingMutationVariables = Exact<{
  input: ListingNewDraft;
}>;

export type ListingCreateContainerCreateListingMutation = {
  __typename?: "Mutation";
  createNewListing?: Maybe<{
    __typename?: "CreateListingPayload";
    listing?: Maybe<{ __typename?: "Listing"; title?: Maybe<string> }>;
  }>;
};

export type ListingDetailContainerListingsQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ListingDetailContainerListingsQuery = {
  __typename?: "Query";
  listing?: Maybe<{
    __typename?: "Listing";
    id: any;
    title?: Maybe<string>;
    description?: Maybe<string>;
    statusCode?: Maybe<string>;
    tags?: Maybe<Array<Maybe<string>>>;
    createdAt?: Maybe<any>;
    account?: Maybe<{ __typename?: "Account"; id: any; name?: Maybe<string> }>;
    primaryCategory?: Maybe<{
      __typename?: "Category";
      id: any;
      name?: Maybe<string>;
    }>;
    draft?: Maybe<{
      __typename?: "Draft";
      title?: Maybe<string>;
      description?: Maybe<string>;
      tags?: Maybe<Array<Maybe<string>>>;
      statusHistory?: Maybe<
        Array<
          Maybe<{
            __typename?: "DraftStatus";
            id: any;
            statusCode?: Maybe<string>;
            statusDetail?: Maybe<string>;
            createdAt?: Maybe<any>;
          }>
        >
      >;
      photos?: Maybe<
        Array<
          Maybe<{
            __typename?: "Photo";
            order?: Maybe<number>;
            documentId?: Maybe<string>;
          }>
        >
      >;
      primaryCategory?: Maybe<{
        __typename?: "Category";
        id: any;
        name?: Maybe<string>;
      }>;
    }>;
    photos?: Maybe<
      Array<
        Maybe<{
          __typename?: "Photo";
          order?: Maybe<number>;
          documentId?: Maybe<string>;
        }>
      >
    >;
    location?: Maybe<{
      __typename?: "Location";
      address?: Maybe<{
        __typename?: "Address";
        freeformAddress?: Maybe<string>;
      }>;
    }>;
  }>;
};

export type ListingDetailContainerUpdateDraftMutationVariables = Exact<{
  input: ListingDraft;
}>;

export type ListingDetailContainerUpdateDraftMutation = {
  __typename?: "Mutation";
  updateDraft?: Maybe<{ __typename?: "Listing"; title?: Maybe<string> }>;
};

export type ListingDetailContainerPublishDraftMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ListingDetailContainerPublishDraftMutation = {
  __typename?: "Mutation";
  listingDraftPublish?: Maybe<string>;
};

export type ListingDetailContainerUnpublishMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ListingDetailContainerUnpublishMutation = {
  __typename?: "Mutation";
  listingUnpublish?: Maybe<string>;
};

export type ListingDetailContainerCreateDraftMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ListingDetailContainerCreateDraftMutation = {
  __typename?: "Mutation";
  listingDraftCreate?: Maybe<string>;
};

export type ListingDetailContainerListingsFieldsFragment = {
  __typename?: "Listing";
  id: any;
  title?: Maybe<string>;
  description?: Maybe<string>;
  statusCode?: Maybe<string>;
  tags?: Maybe<Array<Maybe<string>>>;
  createdAt?: Maybe<any>;
  account?: Maybe<{ __typename?: "Account"; id: any; name?: Maybe<string> }>;
  primaryCategory?: Maybe<{
    __typename?: "Category";
    id: any;
    name?: Maybe<string>;
  }>;
  draft?: Maybe<{
    __typename?: "Draft";
    title?: Maybe<string>;
    description?: Maybe<string>;
    tags?: Maybe<Array<Maybe<string>>>;
    statusHistory?: Maybe<
      Array<
        Maybe<{
          __typename?: "DraftStatus";
          id: any;
          statusCode?: Maybe<string>;
          statusDetail?: Maybe<string>;
          createdAt?: Maybe<any>;
        }>
      >
    >;
    photos?: Maybe<
      Array<
        Maybe<{
          __typename?: "Photo";
          order?: Maybe<number>;
          documentId?: Maybe<string>;
        }>
      >
    >;
    primaryCategory?: Maybe<{
      __typename?: "Category";
      id: any;
      name?: Maybe<string>;
    }>;
  }>;
  photos?: Maybe<
    Array<
      Maybe<{
        __typename?: "Photo";
        order?: Maybe<number>;
        documentId?: Maybe<string>;
      }>
    >
  >;
  location?: Maybe<{
    __typename?: "Location";
    address?: Maybe<{
      __typename?: "Address";
      freeformAddress?: Maybe<string>;
    }>;
  }>;
};

export type ListingDraftPhotosEditContainerListingQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ListingDraftPhotosEditContainerListingQuery = {
  __typename?: "Query";
  listing?: Maybe<{
    __typename?: "Listing";
    id: any;
    draft?: Maybe<{
      __typename?: "Draft";
      photos?: Maybe<
        Array<
          Maybe<{
            __typename?: "Photo";
            order?: Maybe<number>;
            documentId?: Maybe<string>;
          }>
        >
      >;
    }>;
  }>;
};

export type ListingDraftPhotosEditContainerDraftAddPhotoMutationVariables =
  Exact<{
    input: DraftPhotoImageInput;
  }>;

export type ListingDraftPhotosEditContainerDraftAddPhotoMutation = {
  __typename?: "Mutation";
  draftAddPhoto: {
    __typename?: "DraftAuthHeaderForDraftPhotoOutput";
    authHeader?: Maybe<string>;
    blobName?: Maybe<string>;
    requestDate?: Maybe<string>;
    isAuthorized?: Maybe<boolean>;
    errorMessage?: Maybe<string>;
  };
};

export type ListingDraftPhotosEditContainerDraftRemovePhotoMutationVariables =
  Exact<{
    input: DraftRemovePhotoImageInput;
  }>;

export type ListingDraftPhotosEditContainerDraftRemovePhotoMutation = {
  __typename?: "Mutation";
  draftRemovePhoto: {
    __typename?: "DraftRemovePhotoResult";
    success: boolean;
    errorMessage?: Maybe<string>;
  };
};

export type ListingDraftPhotosEditContainerListingFieldsFragment = {
  __typename?: "Listing";
  id: any;
  draft?: Maybe<{
    __typename?: "Draft";
    photos?: Maybe<
      Array<
        Maybe<{
          __typename?: "Photo";
          order?: Maybe<number>;
          documentId?: Maybe<string>;
        }>
      >
    >;
  }>;
};

export type ListingsListListingsByAccountHandleQueryVariables = Exact<{
  handle: Scalars["String"];
}>;

export type ListingsListListingsByAccountHandleQuery = {
  __typename?: "Query";
  listingsByAccountHandle?: Maybe<
    Array<
      Maybe<{
        __typename?: "Listing";
        id: any;
        title?: Maybe<string>;
        description?: Maybe<string>;
        tags?: Maybe<Array<Maybe<string>>>;
        statusCode?: Maybe<string>;
        createdAt?: Maybe<any>;
        updatedAt?: Maybe<any>;
        primaryCategory?: Maybe<{
          __typename?: "Category";
          name?: Maybe<string>;
        }>;
        draft?: Maybe<{ __typename?: "Draft"; title?: Maybe<string> }>;
      }>
    >
  >;
};

export type ListingsListListingsByAccountHandleFieldsFragment = {
  __typename?: "Listing";
  id: any;
  title?: Maybe<string>;
  description?: Maybe<string>;
  tags?: Maybe<Array<Maybe<string>>>;
  statusCode?: Maybe<string>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
  primaryCategory?: Maybe<{ __typename?: "Category"; name?: Maybe<string> }>;
  draft?: Maybe<{ __typename?: "Draft"; title?: Maybe<string> }>;
};

export type PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoMutationVariables =
  Exact<{
    input: UserProfilePhotoImageInput;
  }>;

export type PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoMutation = {
  __typename?: "Mutation";
  userCreateAuthHeaderForProfilePhoto: {
    __typename?: "UserCreateAuthHeaderForProfilePhotoOutput";
    authHeader?: Maybe<string>;
    blobName?: Maybe<string>;
    requestDate?: Maybe<string>;
    isAuthorized?: Maybe<boolean>;
    errorMessage?: Maybe<string>;
  };
};

export type ProfileContainerUserQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ProfileContainerUserQuery = {
  __typename?: "Query";
  currentUser?: Maybe<{
    __typename?: "User";
    id: any;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    email?: Maybe<any>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
  }>;
};

export type ProfileContainerUserUpdateMutationVariables = Exact<{
  input: UserUpdateInput;
}>;

export type ProfileContainerUserUpdateMutation = {
  __typename?: "Mutation";
  updateUser?: Maybe<{
    __typename?: "User";
    id: any;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    email?: Maybe<any>;
    createdAt?: Maybe<any>;
    updatedAt?: Maybe<any>;
  }>;
};

export type ProfileContainerUserFieldsFragment = {
  __typename?: "User";
  id: any;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  email?: Maybe<any>;
  createdAt?: Maybe<any>;
  updatedAt?: Maybe<any>;
};

export type ListingContainerListingSearchQueryVariables = Exact<{
  input: ListingSearchInput;
}>;

export type ListingContainerListingSearchQuery = {
  __typename?: "Query";
  listingSearch?: Maybe<{
    __typename?: "ListingSearchResult";
    listingResults?: Maybe<
      Array<
        Maybe<{
          __typename?: "Listing";
          id: any;
          title?: Maybe<string>;
          description?: Maybe<string>;
          tags?: Maybe<Array<Maybe<string>>>;
          createdAt?: Maybe<any>;
          account?: Maybe<{
            __typename?: "Account";
            id: any;
            name?: Maybe<string>;
          }>;
          primaryCategory?: Maybe<{
            __typename?: "Category";
            id: any;
            name?: Maybe<string>;
          }>;
          photos?: Maybe<
            Array<
              Maybe<{
                __typename?: "Photo";
                order?: Maybe<number>;
                documentId?: Maybe<string>;
              }>
            >
          >;
          location?: Maybe<{
            __typename?: "Location";
            address?: Maybe<{
              __typename?: "Address";
              freeformAddress?: Maybe<string>;
            }>;
          }>;
        }>
      >
    >;
  }>;
};

export type ListingContainerListingSearchFieldsFragment = {
  __typename?: "ListingSearchResult";
  listingResults?: Maybe<
    Array<
      Maybe<{
        __typename?: "Listing";
        id: any;
        title?: Maybe<string>;
        description?: Maybe<string>;
        tags?: Maybe<Array<Maybe<string>>>;
        createdAt?: Maybe<any>;
        account?: Maybe<{
          __typename?: "Account";
          id: any;
          name?: Maybe<string>;
        }>;
        primaryCategory?: Maybe<{
          __typename?: "Category";
          id: any;
          name?: Maybe<string>;
        }>;
        photos?: Maybe<
          Array<
            Maybe<{
              __typename?: "Photo";
              order?: Maybe<number>;
              documentId?: Maybe<string>;
            }>
          >
        >;
        location?: Maybe<{
          __typename?: "Location";
          address?: Maybe<{
            __typename?: "Address";
            freeformAddress?: Maybe<string>;
          }>;
        }>;
      }>
    >
  >;
};

export type SearchResultsContainerListingSearchQueryVariables = Exact<{
  input: ListingSearchInput;
}>;

export type SearchResultsContainerListingSearchQuery = {
  __typename?: "Query";
  listingSearch?: Maybe<{
    __typename?: "ListingSearchResult";
    listingResults?: Maybe<
      Array<
        Maybe<{
          __typename?: "Listing";
          id: any;
          title?: Maybe<string>;
          description?: Maybe<string>;
          tags?: Maybe<Array<Maybe<string>>>;
          createdAt?: Maybe<any>;
          account?: Maybe<{
            __typename?: "Account";
            id: any;
            name?: Maybe<string>;
          }>;
          primaryCategory?: Maybe<{
            __typename?: "Category";
            id: any;
            name?: Maybe<string>;
          }>;
          photos?: Maybe<
            Array<
              Maybe<{
                __typename?: "Photo";
                order?: Maybe<number>;
                documentId?: Maybe<string>;
              }>
            >
          >;
          location?: Maybe<{
            __typename?: "Location";
            address?: Maybe<{
              __typename?: "Address";
              freeformAddress?: Maybe<string>;
            }>;
          }>;
        }>
      >
    >;
    facets?: Maybe<{
      __typename?: "ListingSearchFacets";
      tags?: Maybe<
        Array<
          Maybe<{
            __typename?: "FacetDetail";
            value?: Maybe<string>;
            count?: Maybe<number>;
          }>
        >
      >;
    }>;
  }>;
};

export type SearchResultsContainerListingSearchFieldsFragment = {
  __typename?: "ListingSearchResult";
  listingResults?: Maybe<
    Array<
      Maybe<{
        __typename?: "Listing";
        id: any;
        title?: Maybe<string>;
        description?: Maybe<string>;
        tags?: Maybe<Array<Maybe<string>>>;
        createdAt?: Maybe<any>;
        account?: Maybe<{
          __typename?: "Account";
          id: any;
          name?: Maybe<string>;
        }>;
        primaryCategory?: Maybe<{
          __typename?: "Category";
          id: any;
          name?: Maybe<string>;
        }>;
        photos?: Maybe<
          Array<
            Maybe<{
              __typename?: "Photo";
              order?: Maybe<number>;
              documentId?: Maybe<string>;
            }>
          >
        >;
        location?: Maybe<{
          __typename?: "Location";
          address?: Maybe<{
            __typename?: "Address";
            freeformAddress?: Maybe<string>;
          }>;
        }>;
      }>
    >
  >;
  facets?: Maybe<{
    __typename?: "ListingSearchFacets";
    tags?: Maybe<
      Array<
        Maybe<{
          __typename?: "FacetDetail";
          value?: Maybe<string>;
          count?: Maybe<number>;
        }>
      >
    >;
  }>;
};

export type LoggedInUserContainerCurrentUserQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type LoggedInUserContainerCurrentUserQueryQuery = {
  __typename?: "Query";
  currentUser?: Maybe<{
    __typename?: "User";
    id: any;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
  }>;
};

export type LoggedInUserContainerCurrentUserFieldsFragment = {
  __typename?: "User";
  id: any;
  externalId?: Maybe<string>;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
};

export type UserCreateMutationVariables = Exact<{ [key: string]: never }>;

export type UserCreateMutation = {
  __typename?: "Mutation";
  createUser?: Maybe<{
    __typename?: "User";
    id: any;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
  }>;
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

export const AccountSelectionAccountFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "AccountSelectionAccountFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Account" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AccountSelectionAccountFieldsFragment, unknown>;
export const CategorySelectionCategoryFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "CategorySelectionCategoryFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Category" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CategorySelectionCategoryFieldsFragment, unknown>;
export const AccountMenuAccountFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "AccountMenuAccountFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Account" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          { kind: "Field", name: { kind: "Name", value: "handle" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AccountMenuAccountFieldsFragment, unknown>;
export const AccountSettingsContactsContainerAccountGetByHandleFieldsFragmentDoc =
  {
    kind: "Document",
    definitions: [
      {
        kind: "FragmentDefinition",
        name: {
          kind: "Name",
          value: "AccountSettingsContactsContainerAccountGetByHandleFields",
        },
        typeCondition: {
          kind: "NamedType",
          name: { kind: "Name", value: "Account" },
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            { kind: "Field", name: { kind: "Name", value: "id" } },
            { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
            { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
            { kind: "Field", name: { kind: "Name", value: "handle" } },
            { kind: "Field", name: { kind: "Name", value: "name" } },
            {
              kind: "Field",
              name: { kind: "Name", value: "contacts" },
              selectionSet: {
                kind: "SelectionSet",
                selections: [
                  { kind: "Field", name: { kind: "Name", value: "firstName" } },
                  { kind: "Field", name: { kind: "Name", value: "lastName" } },
                  {
                    kind: "Field",
                    name: { kind: "Name", value: "role" },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [
                        { kind: "Field", name: { kind: "Name", value: "id" } },
                        {
                          kind: "Field",
                          name: { kind: "Name", value: "roleName" },
                        },
                      ],
                    },
                  },
                  {
                    kind: "Field",
                    name: { kind: "Name", value: "user" },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [
                        { kind: "Field", name: { kind: "Name", value: "id" } },
                      ],
                    },
                  },
                  { kind: "Field", name: { kind: "Name", value: "id" } },
                  { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                  { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                ],
              },
            },
          ],
        },
      },
    ],
  } as unknown as DocumentNode<
    AccountSettingsContactsContainerAccountGetByHandleFieldsFragment,
    unknown
  >;
export const AccountSettingsGeneralContainerAccountFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "AccountSettingsGeneralContainerAccountFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Account" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          { kind: "Field", name: { kind: "Name", value: "handle" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountSettingsGeneralContainerAccountFieldsFragment,
  unknown
>;
export const AccountSettingsRolesContainerAccountGetByHandleFieldsFragmentDoc =
  {
    kind: "Document",
    definitions: [
      {
        kind: "FragmentDefinition",
        name: {
          kind: "Name",
          value: "AccountSettingsRolesContainerAccountGetByHandleFields",
        },
        typeCondition: {
          kind: "NamedType",
          name: { kind: "Name", value: "Account" },
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            { kind: "Field", name: { kind: "Name", value: "id" } },
            { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
            { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
            { kind: "Field", name: { kind: "Name", value: "handle" } },
            { kind: "Field", name: { kind: "Name", value: "name" } },
            {
              kind: "Field",
              name: { kind: "Name", value: "roles" },
              selectionSet: {
                kind: "SelectionSet",
                selections: [
                  { kind: "Field", name: { kind: "Name", value: "id" } },
                  { kind: "Field", name: { kind: "Name", value: "roleName" } },
                  { kind: "Field", name: { kind: "Name", value: "isDefault" } },
                  {
                    kind: "Field",
                    name: { kind: "Name", value: "permissions" },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [
                        {
                          kind: "Field",
                          name: { kind: "Name", value: "listingPermissions" },
                          selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                              {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "canManageListings",
                                },
                              },
                            ],
                          },
                        },
                        {
                          kind: "Field",
                          name: { kind: "Name", value: "accountPermissions" },
                          selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                              {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "canManageRolesAndPermissions",
                                },
                              },
                              {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "canManageAccountSettings",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  } as unknown as DocumentNode<
    AccountSettingsRolesContainerAccountGetByHandleFieldsFragment,
    unknown
  >;
export const ListingCategorySelectionContainerFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ListingCategorySelectionContainerFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Category" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "parentId" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingCategorySelectionContainerFieldsFragment,
  unknown
>;
export const ListingDetailContainerListingsFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ListingDetailContainerListingsFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Listing" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "account" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "statusCode" } },
          { kind: "Field", name: { kind: "Name", value: "tags" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryCategory" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "draft" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "tags" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "statusHistory" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "statusCode" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "statusDetail" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "photos" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "order" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "documentId" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryCategory" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "photos" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "order" } },
                { kind: "Field", name: { kind: "Name", value: "documentId" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "location" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "address" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "freeformAddress" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDetailContainerListingsFieldsFragment,
  unknown
>;
export const ListingDraftPhotosEditContainerListingFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "ListingDraftPhotosEditContainerListingFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Listing" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "draft" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "photos" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "order" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "documentId" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDraftPhotosEditContainerListingFieldsFragment,
  unknown
>;
export const ListingsListListingsByAccountHandleFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "ListingsListListingsByAccountHandleFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Listing" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "tags" } },
          { kind: "Field", name: { kind: "Name", value: "statusCode" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryCategory" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "draft" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingsListListingsByAccountHandleFieldsFragment,
  unknown
>;
export const ProfileContainerUserFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ProfileContainerUserFields" },
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
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProfileContainerUserFieldsFragment, unknown>;
export const ListingContainerListingSearchFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ListingContainerListingSearchFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ListingSearchResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "listingResults" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "tags" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryCategory" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "photos" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "order" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "documentId" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "freeformAddress" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingContainerListingSearchFieldsFragment,
  unknown
>;
export const SearchResultsContainerListingSearchFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "SearchResultsContainerListingSearchFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ListingSearchResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "listingResults" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "tags" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryCategory" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "photos" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "order" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "documentId" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "freeformAddress" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "facets" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tags" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SearchResultsContainerListingSearchFieldsFragment,
  unknown
>;
export const LoggedInUserContainerCurrentUserFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "LoggedInUserContainerCurrentUserFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "User" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "externalId" } },
          { kind: "Field", name: { kind: "Name", value: "firstName" } },
          { kind: "Field", name: { kind: "Name", value: "lastName" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  LoggedInUserContainerCurrentUserFieldsFragment,
  unknown
>;
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
export const AccountSelectionAccountsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AccountSelectionAccounts" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accounts" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "AccountSelectionAccountFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...AccountSelectionAccountFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AccountSelectionAccountsQuery,
  AccountSelectionAccountsQueryVariables
>;
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
export const CategorySelectionCategoriesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CategorySelectionCategories" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "categories" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "CategorySelectionCategoryFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CategorySelectionCategoryFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CategorySelectionCategoriesQuery,
  CategorySelectionCategoriesQueryVariables
>;
export const AccountMenuAccountsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AccountMenuAccounts" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accounts" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "AccountMenuAccountFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...AccountMenuAccountFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AccountMenuAccountsQuery,
  AccountMenuAccountsQueryVariables
>;
export const AccountSettingsContactsContainerAccountGetByHandleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "AccountSettingsContactsContainerAccountGetByHandle",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "handle" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountGetByHandle" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "handle" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "handle" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value:
                      "AccountSettingsContactsContainerAccountGetByHandleFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...AccountSettingsContactsContainerAccountGetByHandleFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AccountSettingsContactsContainerAccountGetByHandleQuery,
  AccountSettingsContactsContainerAccountGetByHandleQueryVariables
>;
export const AccountSettingsGeneralContainerAccountGetByHandleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "AccountSettingsGeneralContainerAccountGetByHandle",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "handle" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountGetByHandle" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "handle" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "handle" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "AccountMenuAccountFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...AccountMenuAccountFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AccountSettingsGeneralContainerAccountGetByHandleQuery,
  AccountSettingsGeneralContainerAccountGetByHandleQueryVariables
>;
export const AccountSettingsGeneralContainerUpdateAccountDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "AccountSettingsGeneralContainerUpdateAccount",
      },
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
              name: { kind: "Name", value: "AccountUpdateInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateAccount" },
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
                  name: { kind: "Name", value: "AccountMenuAccountFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...AccountMenuAccountFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AccountSettingsGeneralContainerUpdateAccountMutation,
  AccountSettingsGeneralContainerUpdateAccountMutationVariables
>;
export const AccountSettingsRolesContainerAccountGetByHandleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "AccountSettingsRolesContainerAccountGetByHandle",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "handle" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountGetByHandle" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "handle" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "handle" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value:
                      "AccountSettingsRolesContainerAccountGetByHandleFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...AccountSettingsRolesContainerAccountGetByHandleFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  AccountSettingsRolesContainerAccountGetByHandleQuery,
  AccountSettingsRolesContainerAccountGetByHandleQueryVariables
>;
export const AccountSettingsRolesContainerAccountAddRoleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "AccountSettingsRolesContainerAccountAddRole",
      },
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
              name: { kind: "Name", value: "RoleAddInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountAddRole" },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountSettingsRolesContainerAccountAddRoleMutation,
  AccountSettingsRolesContainerAccountAddRoleMutationVariables
>;
export const AccountSettingsRolesContainerAccountUpdateRoleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "AccountSettingsRolesContainerAccountUpdateRole",
      },
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
              name: { kind: "Name", value: "RoleUpdateInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "accountUpdateRole" },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AccountSettingsRolesContainerAccountUpdateRoleMutation,
  AccountSettingsRolesContainerAccountUpdateRoleMutationVariables
>;
export const ListingCategorySelectionContainerCategoriesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "ListingCategorySelectionContainerCategories",
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "categories" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "CategorySelectionCategoryFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CategorySelectionCategoryFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ListingCategorySelectionContainerCategoriesQuery,
  ListingCategorySelectionContainerCategoriesQueryVariables
>;
export const ListingCreateContainerCreateListingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ListingCreateContainerCreateListing" },
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
              name: { kind: "Name", value: "ListingNewDraft" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createNewListing" },
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
                  kind: "Field",
                  name: { kind: "Name", value: "listing" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingCreateContainerCreateListingMutation,
  ListingCreateContainerCreateListingMutationVariables
>;
export const ListingDetailContainerListingsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ListingDetailContainerListings" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
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
            name: { kind: "Name", value: "listing" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "ListingDetailContainerListingsFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...ListingDetailContainerListingsFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ListingDetailContainerListingsQuery,
  ListingDetailContainerListingsQueryVariables
>;
export const ListingDetailContainerUpdateDraftDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ListingDetailContainerUpdateDraft" },
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
              name: { kind: "Name", value: "ListingDraft" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateDraft" },
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
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDetailContainerUpdateDraftMutation,
  ListingDetailContainerUpdateDraftMutationVariables
>;
export const ListingDetailContainerPublishDraftDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ListingDetailContainerPublishDraft" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
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
            name: { kind: "Name", value: "listingDraftPublish" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDetailContainerPublishDraftMutation,
  ListingDetailContainerPublishDraftMutationVariables
>;
export const ListingDetailContainerUnpublishDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ListingDetailContainerUnpublish" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
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
            name: { kind: "Name", value: "listingUnpublish" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDetailContainerUnpublishMutation,
  ListingDetailContainerUnpublishMutationVariables
>;
export const ListingDetailContainerCreateDraftDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ListingDetailContainerCreateDraft" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
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
            name: { kind: "Name", value: "listingDraftCreate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDetailContainerCreateDraftMutation,
  ListingDetailContainerCreateDraftMutationVariables
>;
export const ListingDraftPhotosEditContainerListingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ListingDraftPhotosEditContainerListing" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
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
            name: { kind: "Name", value: "listing" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "ListingDraftPhotosEditContainerListingFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...ListingDraftPhotosEditContainerListingFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ListingDraftPhotosEditContainerListingQuery,
  ListingDraftPhotosEditContainerListingQueryVariables
>;
export const ListingDraftPhotosEditContainerDraftAddPhotoDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "ListingDraftPhotosEditContainerDraftAddPhoto",
      },
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
              name: { kind: "Name", value: "DraftPhotoImageInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "draftAddPhoto" },
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
                { kind: "Field", name: { kind: "Name", value: "authHeader" } },
                { kind: "Field", name: { kind: "Name", value: "blobName" } },
                { kind: "Field", name: { kind: "Name", value: "requestDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "isAuthorized" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errorMessage" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDraftPhotosEditContainerDraftAddPhotoMutation,
  ListingDraftPhotosEditContainerDraftAddPhotoMutationVariables
>;
export const ListingDraftPhotosEditContainerDraftRemovePhotoDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "ListingDraftPhotosEditContainerDraftRemovePhoto",
      },
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
              name: { kind: "Name", value: "DraftRemovePhotoImageInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "draftRemovePhoto" },
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
                { kind: "Field", name: { kind: "Name", value: "success" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errorMessage" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListingDraftPhotosEditContainerDraftRemovePhotoMutation,
  ListingDraftPhotosEditContainerDraftRemovePhotoMutationVariables
>;
export const ListingsListListingsByAccountHandleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ListingsListListingsByAccountHandle" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "handle" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "listingsByAccountHandle" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "handle" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "handle" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: {
                    kind: "Name",
                    value: "ListingsListListingsByAccountHandleFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...ListingsListListingsByAccountHandleFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ListingsListListingsByAccountHandleQuery,
  ListingsListListingsByAccountHandleQueryVariables
>;
export const PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "PhotoUploadContainerUserCreateAuthHeaderForProfilePhoto",
      },
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
              name: { kind: "Name", value: "UserProfilePhotoImageInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "userCreateAuthHeaderForProfilePhoto",
            },
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
                { kind: "Field", name: { kind: "Name", value: "authHeader" } },
                { kind: "Field", name: { kind: "Name", value: "blobName" } },
                { kind: "Field", name: { kind: "Name", value: "requestDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "isAuthorized" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errorMessage" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoMutation,
  PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoMutationVariables
>;
export const ProfileContainerUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProfileContainerUser" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ProfileContainerUserFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...ProfileContainerUserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ProfileContainerUserQuery,
  ProfileContainerUserQueryVariables
>;
export const ProfileContainerUserUpdateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ProfileContainerUserUpdate" },
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
                  name: { kind: "Name", value: "ProfileContainerUserFields" },
                },
              ],
            },
          },
        ],
      },
    },
    ...ProfileContainerUserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ProfileContainerUserUpdateMutation,
  ProfileContainerUserUpdateMutationVariables
>;
export const ListingContainerListingSearchDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ListingContainerListingSearch" },
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
              name: { kind: "Name", value: "ListingSearchInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "listingSearch" },
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
                  name: {
                    kind: "Name",
                    value: "ListingContainerListingSearchFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...ListingContainerListingSearchFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ListingContainerListingSearchQuery,
  ListingContainerListingSearchQueryVariables
>;
export const SearchResultsContainerListingSearchDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SearchResultsContainerListingSearch" },
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
              name: { kind: "Name", value: "ListingSearchInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "listingSearch" },
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
                  name: {
                    kind: "Name",
                    value: "SearchResultsContainerListingSearchFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...SearchResultsContainerListingSearchFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  SearchResultsContainerListingSearchQuery,
  SearchResultsContainerListingSearchQueryVariables
>;
export const LoggedInUserContainerCurrentUserQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LoggedInUserContainerCurrentUserQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
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
} as unknown as DocumentNode<
  LoggedInUserContainerCurrentUserQueryQuery,
  LoggedInUserContainerCurrentUserQueryQueryVariables
>;
export const UserCreateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UserCreate" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createUser" },
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
      },
    },
  ],
} as unknown as DocumentNode<UserCreateMutation, UserCreateMutationVariables>;
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
