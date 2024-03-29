import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { Context } from "./context";
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
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} & { [P in K]-?: NonNullable<T[P]> };
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
  Date: Date;
  DateTime: any;
  Duration: any;
  EmailAddress: string;
  GUID: string;
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
  listing?: Maybe<Listing>;
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

export type ListingMutationResult = {
  __typename?: "ListingMutationResult";
  status: ListingMutationStatus;
  listing: Listing;
};

export type ListingMutationStatus = {
  __typename?: "ListingMutationStatus";
  success: Scalars["Boolean"];
  errorMessage?: Maybe<Scalars["String"]>;
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
  createNewListing: ListingMutationResult;
  createUser?: Maybe<User>;
  draftAddPhoto: DraftAuthHeaderForDraftPhotoOutput;
  draftRemovePhoto: ListingMutationResult;
  listingDraftCreate: ListingMutationResult;
  listingDraftPublish: ListingMutationResult;
  listingUnpublish: ListingMutationResult;
  updateAccount?: Maybe<Account>;
  updateCategory?: Maybe<Category>;
  updateDraft: ListingMutationResult;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Account: ResolverTypeWrapper<Account>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  AccountPermissions: ResolverTypeWrapper<AccountPermissions>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  AccountPermissionsInput: AccountPermissionsInput;
  AccountUpdateInput: AccountUpdateInput;
  Address: ResolverTypeWrapper<Address>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]>;
  Byte: ResolverTypeWrapper<Scalars["Byte"]>;
  CacheControlScope: CacheControlScope;
  Category: ResolverTypeWrapper<Category>;
  CategoryDetail: CategoryDetail;
  Contact: ResolverTypeWrapper<Contact>;
  CreateListingPayload: ResolverTypeWrapper<CreateListingPayload>;
  Currency: ResolverTypeWrapper<Scalars["Currency"]>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  Draft: ResolverTypeWrapper<Draft>;
  DraftAuthHeaderForDraftPhotoOutput: ResolverTypeWrapper<DraftAuthHeaderForDraftPhotoOutput>;
  DraftPhotoImageInput: DraftPhotoImageInput;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  DraftRemovePhotoImageInput: DraftRemovePhotoImageInput;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  DraftRemovePhotoResult: ResolverTypeWrapper<DraftRemovePhotoResult>;
  DraftStatus: ResolverTypeWrapper<DraftStatus>;
  Duration: ResolverTypeWrapper<Scalars["Duration"]>;
  EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]>;
  FacetDetail: ResolverTypeWrapper<FacetDetail>;
  GUID: ResolverTypeWrapper<Scalars["GUID"]>;
  HSL: ResolverTypeWrapper<Scalars["HSL"]>;
  HSLA: ResolverTypeWrapper<Scalars["HSLA"]>;
  HexColorCode: ResolverTypeWrapper<Scalars["HexColorCode"]>;
  Hexadecimal: ResolverTypeWrapper<Scalars["Hexadecimal"]>;
  IBAN: ResolverTypeWrapper<Scalars["IBAN"]>;
  IPv4: ResolverTypeWrapper<Scalars["IPv4"]>;
  IPv6: ResolverTypeWrapper<Scalars["IPv6"]>;
  ISBN: ResolverTypeWrapper<Scalars["ISBN"]>;
  ISO8601Duration: ResolverTypeWrapper<Scalars["ISO8601Duration"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]>;
  JSONObject: ResolverTypeWrapper<Scalars["JSONObject"]>;
  JWT: ResolverTypeWrapper<Scalars["JWT"]>;
  Latitude: ResolverTypeWrapper<Scalars["Latitude"]>;
  Listing: ResolverTypeWrapper<Listing>;
  ListingDetail: ListingDetail;
  ListingDraft: ListingDraft;
  ListingMutationResult: ResolverTypeWrapper<ListingMutationResult>;
  ListingMutationStatus: ResolverTypeWrapper<ListingMutationStatus>;
  ListingNewDraft: ListingNewDraft;
  ListingPermissions: ResolverTypeWrapper<ListingPermissions>;
  ListingPermissionsInput: ListingPermissionsInput;
  ListingSearchFacets: ResolverTypeWrapper<ListingSearchFacets>;
  ListingSearchInput: ListingSearchInput;
  ListingSearchResult: ResolverTypeWrapper<ListingSearchResult>;
  LocalDate: ResolverTypeWrapper<Scalars["LocalDate"]>;
  LocalEndTime: ResolverTypeWrapper<Scalars["LocalEndTime"]>;
  LocalTime: ResolverTypeWrapper<Scalars["LocalTime"]>;
  Location: ResolverTypeWrapper<Location>;
  Long: ResolverTypeWrapper<Scalars["Long"]>;
  Longitude: ResolverTypeWrapper<Scalars["Longitude"]>;
  MAC: ResolverTypeWrapper<Scalars["MAC"]>;
  MongoBase:
    | ResolversTypes["Account"]
    | ResolversTypes["Category"]
    | ResolversTypes["Listing"]
    | ResolversTypes["Location"]
    | ResolversTypes["Point"]
    | ResolversTypes["User"];
  Mutation: ResolverTypeWrapper<{}>;
  NegativeFloat: ResolverTypeWrapper<Scalars["NegativeFloat"]>;
  NegativeInt: ResolverTypeWrapper<Scalars["NegativeInt"]>;
  NonEmptyString: ResolverTypeWrapper<Scalars["NonEmptyString"]>;
  NonNegativeFloat: ResolverTypeWrapper<Scalars["NonNegativeFloat"]>;
  NonNegativeInt: ResolverTypeWrapper<Scalars["NonNegativeInt"]>;
  NonPositiveFloat: ResolverTypeWrapper<Scalars["NonPositiveFloat"]>;
  NonPositiveInt: ResolverTypeWrapper<Scalars["NonPositiveInt"]>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]>;
  Permissions: ResolverTypeWrapper<Permissions>;
  PermissionsInput: PermissionsInput;
  PhoneNumber: ResolverTypeWrapper<Scalars["PhoneNumber"]>;
  Photo: ResolverTypeWrapper<Photo>;
  Point: ResolverTypeWrapper<Point>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Port: ResolverTypeWrapper<Scalars["Port"]>;
  PositiveFloat: ResolverTypeWrapper<Scalars["PositiveFloat"]>;
  PositiveInt: ResolverTypeWrapper<Scalars["PositiveInt"]>;
  PostalCode: ResolverTypeWrapper<Scalars["PostalCode"]>;
  Query: ResolverTypeWrapper<{}>;
  RGB: ResolverTypeWrapper<Scalars["RGB"]>;
  RGBA: ResolverTypeWrapper<Scalars["RGBA"]>;
  Role: ResolverTypeWrapper<Role>;
  RoleAddInput: RoleAddInput;
  RoleUpdateInput: RoleUpdateInput;
  SafeInt: ResolverTypeWrapper<Scalars["SafeInt"]>;
  Time: ResolverTypeWrapper<Scalars["Time"]>;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]>;
  URL: ResolverTypeWrapper<Scalars["URL"]>;
  USCurrency: ResolverTypeWrapper<Scalars["USCurrency"]>;
  UUID: ResolverTypeWrapper<Scalars["UUID"]>;
  UnsignedFloat: ResolverTypeWrapper<Scalars["UnsignedFloat"]>;
  UnsignedInt: ResolverTypeWrapper<Scalars["UnsignedInt"]>;
  UpdateCategory: UpdateCategory;
  User: ResolverTypeWrapper<User>;
  UserCreateAuthHeaderForProfilePhotoOutput: ResolverTypeWrapper<UserCreateAuthHeaderForProfilePhotoOutput>;
  UserProfilePhotoImageInput: UserProfilePhotoImageInput;
  UserUpdateInput: UserUpdateInput;
  UtcOffset: ResolverTypeWrapper<Scalars["UtcOffset"]>;
  Void: ResolverTypeWrapper<Scalars["Void"]>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: Account;
  String: Scalars["String"];
  AccountPermissions: AccountPermissions;
  Boolean: Scalars["Boolean"];
  AccountPermissionsInput: AccountPermissionsInput;
  AccountUpdateInput: AccountUpdateInput;
  Address: Address;
  BigInt: Scalars["BigInt"];
  Byte: Scalars["Byte"];
  Category: Category;
  CategoryDetail: CategoryDetail;
  Contact: Contact;
  CreateListingPayload: CreateListingPayload;
  Currency: Scalars["Currency"];
  Date: Scalars["Date"];
  DateTime: Scalars["DateTime"];
  Draft: Draft;
  DraftAuthHeaderForDraftPhotoOutput: DraftAuthHeaderForDraftPhotoOutput;
  DraftPhotoImageInput: DraftPhotoImageInput;
  Int: Scalars["Int"];
  DraftRemovePhotoImageInput: DraftRemovePhotoImageInput;
  ID: Scalars["ID"];
  DraftRemovePhotoResult: DraftRemovePhotoResult;
  DraftStatus: DraftStatus;
  Duration: Scalars["Duration"];
  EmailAddress: Scalars["EmailAddress"];
  FacetDetail: FacetDetail;
  GUID: Scalars["GUID"];
  HSL: Scalars["HSL"];
  HSLA: Scalars["HSLA"];
  HexColorCode: Scalars["HexColorCode"];
  Hexadecimal: Scalars["Hexadecimal"];
  IBAN: Scalars["IBAN"];
  IPv4: Scalars["IPv4"];
  IPv6: Scalars["IPv6"];
  ISBN: Scalars["ISBN"];
  ISO8601Duration: Scalars["ISO8601Duration"];
  JSON: Scalars["JSON"];
  JSONObject: Scalars["JSONObject"];
  JWT: Scalars["JWT"];
  Latitude: Scalars["Latitude"];
  Listing: Listing;
  ListingDetail: ListingDetail;
  ListingDraft: ListingDraft;
  ListingMutationResult: ListingMutationResult;
  ListingMutationStatus: ListingMutationStatus;
  ListingNewDraft: ListingNewDraft;
  ListingPermissions: ListingPermissions;
  ListingPermissionsInput: ListingPermissionsInput;
  ListingSearchFacets: ListingSearchFacets;
  ListingSearchInput: ListingSearchInput;
  ListingSearchResult: ListingSearchResult;
  LocalDate: Scalars["LocalDate"];
  LocalEndTime: Scalars["LocalEndTime"];
  LocalTime: Scalars["LocalTime"];
  Location: Location;
  Long: Scalars["Long"];
  Longitude: Scalars["Longitude"];
  MAC: Scalars["MAC"];
  MongoBase:
    | ResolversParentTypes["Account"]
    | ResolversParentTypes["Category"]
    | ResolversParentTypes["Listing"]
    | ResolversParentTypes["Location"]
    | ResolversParentTypes["Point"]
    | ResolversParentTypes["User"];
  Mutation: {};
  NegativeFloat: Scalars["NegativeFloat"];
  NegativeInt: Scalars["NegativeInt"];
  NonEmptyString: Scalars["NonEmptyString"];
  NonNegativeFloat: Scalars["NonNegativeFloat"];
  NonNegativeInt: Scalars["NonNegativeInt"];
  NonPositiveFloat: Scalars["NonPositiveFloat"];
  NonPositiveInt: Scalars["NonPositiveInt"];
  ObjectID: Scalars["ObjectID"];
  Permissions: Permissions;
  PermissionsInput: PermissionsInput;
  PhoneNumber: Scalars["PhoneNumber"];
  Photo: Photo;
  Point: Point;
  Float: Scalars["Float"];
  Port: Scalars["Port"];
  PositiveFloat: Scalars["PositiveFloat"];
  PositiveInt: Scalars["PositiveInt"];
  PostalCode: Scalars["PostalCode"];
  Query: {};
  RGB: Scalars["RGB"];
  RGBA: Scalars["RGBA"];
  Role: Role;
  RoleAddInput: RoleAddInput;
  RoleUpdateInput: RoleUpdateInput;
  SafeInt: Scalars["SafeInt"];
  Time: Scalars["Time"];
  Timestamp: Scalars["Timestamp"];
  URL: Scalars["URL"];
  USCurrency: Scalars["USCurrency"];
  UUID: Scalars["UUID"];
  UnsignedFloat: Scalars["UnsignedFloat"];
  UnsignedInt: Scalars["UnsignedInt"];
  UpdateCategory: UpdateCategory;
  User: User;
  UserCreateAuthHeaderForProfilePhotoOutput: UserCreateAuthHeaderForProfilePhotoOutput;
  UserProfilePhotoImageInput: UserProfilePhotoImageInput;
  UserUpdateInput: UserUpdateInput;
  UtcOffset: Scalars["UtcOffset"];
  Void: Scalars["Void"];
}>;

export type CacheControl22DirectiveArgs = {
  maxAge?: Maybe<Scalars["Int"]>;
  scope?: Maybe<CacheControlScope>;
  inheritMaxAge?: Maybe<Scalars["Boolean"]>;
};

export type CacheControl22DirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = CacheControl22DirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Account"] = ResolversParentTypes["Account"]
> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  handle?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  roles?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Role"]>>>,
    ParentType,
    ContextType
  >;
  contacts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Contact"]>>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountPermissionsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AccountPermissions"] = ResolversParentTypes["AccountPermissions"]
> = ResolversObject<{
  canManageRolesAndPermissions?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  canManageAccountSettings?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddressResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Address"] = ResolversParentTypes["Address"]
> = ResolversObject<{
  streetNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  streetName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  municipality?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  municipalitySubdivision?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  countrySecondarySubdivision?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  countryTertiarySubdivision?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  countrySubdivision?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  countrySubdivisionName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  postalCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  extendedPostalCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  countryCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  countryCodeISO3?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  freeformAddress?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface ByteScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Byte"], any> {
  name: "Byte";
}

export type CategoryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Category"] = ResolversParentTypes["Category"]
> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  parentId?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType
  >;
  childrenIds?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Category"]>>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContactResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Contact"] = ResolversParentTypes["Contact"]
> = ResolversObject<{
  firstName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes["Role"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateListingPayloadResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["CreateListingPayload"] = ResolversParentTypes["CreateListingPayload"]
> = ResolversObject<{
  listing?: Resolver<Maybe<ResolversTypes["Listing"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface CurrencyScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Currency"], any> {
  name: "Currency";
}

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type DraftResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Draft"] = ResolversParentTypes["Draft"]
> = ResolversObject<{
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  tags?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  photos?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Photo"]>>>,
    ParentType,
    ContextType
  >;
  primaryCategory?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType
  >;
  statusHistory?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["DraftStatus"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DraftAuthHeaderForDraftPhotoOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["DraftAuthHeaderForDraftPhotoOutput"] = ResolversParentTypes["DraftAuthHeaderForDraftPhotoOutput"]
> = ResolversObject<{
  authHeader?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  blobName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  requestDate?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  isAuthorized?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  errorMessage?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  listing?: Resolver<Maybe<ResolversTypes["Listing"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DraftRemovePhotoResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["DraftRemovePhotoResult"] = ResolversParentTypes["DraftRemovePhotoResult"]
> = ResolversObject<{
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  errorMessage?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DraftStatusResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["DraftStatus"] = ResolversParentTypes["DraftStatus"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  statusCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  statusDetail?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DurationScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Duration"], any> {
  name: "Duration";
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["EmailAddress"], any> {
  name: "EmailAddress";
}

export type FacetDetailResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["FacetDetail"] = ResolversParentTypes["FacetDetail"]
> = ResolversObject<{
  value?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  count?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface GuidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["GUID"], any> {
  name: "GUID";
}

export interface HslScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["HSL"], any> {
  name: "HSL";
}

export interface HslaScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["HSLA"], any> {
  name: "HSLA";
}

export interface HexColorCodeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["HexColorCode"], any> {
  name: "HexColorCode";
}

export interface HexadecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Hexadecimal"], any> {
  name: "Hexadecimal";
}

export interface IbanScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["IBAN"], any> {
  name: "IBAN";
}

export interface IPv4ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["IPv4"], any> {
  name: "IPv4";
}

export interface IPv6ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["IPv6"], any> {
  name: "IPv6";
}

export interface IsbnScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["ISBN"], any> {
  name: "ISBN";
}

export interface Iso8601DurationScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["ISO8601Duration"], any> {
  name: "ISO8601Duration";
}

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export interface JsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSONObject"], any> {
  name: "JSONObject";
}

export interface JwtScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JWT"], any> {
  name: "JWT";
}

export interface LatitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Latitude"], any> {
  name: "Latitude";
}

export type ListingResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Listing"] = ResolversParentTypes["Listing"]
> = ResolversObject<{
  account?: Resolver<Maybe<ResolversTypes["Account"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  statusCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  tags?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  primaryCategory?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType
  >;
  photos?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Photo"]>>>,
    ParentType,
    ContextType
  >;
  location?: Resolver<
    Maybe<ResolversTypes["Location"]>,
    ParentType,
    ContextType
  >;
  draft?: Resolver<Maybe<ResolversTypes["Draft"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingMutationResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ListingMutationResult"] = ResolversParentTypes["ListingMutationResult"]
> = ResolversObject<{
  status?: Resolver<
    ResolversTypes["ListingMutationStatus"],
    ParentType,
    ContextType
  >;
  listing?: Resolver<ResolversTypes["Listing"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingMutationStatusResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ListingMutationStatus"] = ResolversParentTypes["ListingMutationStatus"]
> = ResolversObject<{
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  errorMessage?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingPermissionsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ListingPermissions"] = ResolversParentTypes["ListingPermissions"]
> = ResolversObject<{
  canManageListings?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingSearchFacetsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ListingSearchFacets"] = ResolversParentTypes["ListingSearchFacets"]
> = ResolversObject<{
  tags?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FacetDetail"]>>>,
    ParentType,
    ContextType
  >;
  primaryCategory?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FacetDetail"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingSearchResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ListingSearchResult"] = ResolversParentTypes["ListingSearchResult"]
> = ResolversObject<{
  listingResults?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Listing"]>>>,
    ParentType,
    ContextType
  >;
  total?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  facets?: Resolver<
    Maybe<ResolversTypes["ListingSearchFacets"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface LocalDateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["LocalDate"], any> {
  name: "LocalDate";
}

export interface LocalEndTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["LocalEndTime"], any> {
  name: "LocalEndTime";
}

export interface LocalTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["LocalTime"], any> {
  name: "LocalTime";
}

export type LocationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Location"] = ResolversParentTypes["Location"]
> = ResolversObject<{
  position?: Resolver<Maybe<ResolversTypes["Point"]>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes["Address"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface LongScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Long"], any> {
  name: "Long";
}

export interface LongitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Longitude"], any> {
  name: "Longitude";
}

export interface MacScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["MAC"], any> {
  name: "MAC";
}

export type MongoBaseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["MongoBase"] = ResolversParentTypes["MongoBase"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "Account" | "Category" | "Listing" | "Location" | "Point" | "User",
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  accountAddRole?: Resolver<
    Maybe<ResolversTypes["Account"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAccountAddRoleArgs, "input">
  >;
  accountUpdateRole?: Resolver<
    Maybe<ResolversTypes["Account"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAccountUpdateRoleArgs, "input">
  >;
  createCategory?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCategoryArgs, "category">
  >;
  createNewListing?: Resolver<
    ResolversTypes["ListingMutationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateNewListingArgs, "input">
  >;
  createUser?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  draftAddPhoto?: Resolver<
    ResolversTypes["DraftAuthHeaderForDraftPhotoOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationDraftAddPhotoArgs, "input">
  >;
  draftRemovePhoto?: Resolver<
    ResolversTypes["ListingMutationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationDraftRemovePhotoArgs, "input">
  >;
  listingDraftCreate?: Resolver<
    ResolversTypes["ListingMutationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationListingDraftCreateArgs, "id">
  >;
  listingDraftPublish?: Resolver<
    ResolversTypes["ListingMutationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationListingDraftPublishArgs, "id">
  >;
  listingUnpublish?: Resolver<
    ResolversTypes["ListingMutationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationListingUnpublishArgs, "id">
  >;
  updateAccount?: Resolver<
    Maybe<ResolversTypes["Account"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateAccountArgs, "input">
  >;
  updateCategory?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCategoryArgs, "category">
  >;
  updateDraft?: Resolver<
    ResolversTypes["ListingMutationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateDraftArgs, "input">
  >;
  updateUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, "input">
  >;
  userCreateAuthHeaderForProfilePhoto?: Resolver<
    ResolversTypes["UserCreateAuthHeaderForProfilePhotoOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationUserCreateAuthHeaderForProfilePhotoArgs, "input">
  >;
}>;

export interface NegativeFloatScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NegativeFloat"], any> {
  name: "NegativeFloat";
}

export interface NegativeIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NegativeInt"], any> {
  name: "NegativeInt";
}

export interface NonEmptyStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NonEmptyString"], any> {
  name: "NonEmptyString";
}

export interface NonNegativeFloatScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NonNegativeFloat"], any> {
  name: "NonNegativeFloat";
}

export interface NonNegativeIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NonNegativeInt"], any> {
  name: "NonNegativeInt";
}

export interface NonPositiveFloatScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NonPositiveFloat"], any> {
  name: "NonPositiveFloat";
}

export interface NonPositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NonPositiveInt"], any> {
  name: "NonPositiveInt";
}

export interface ObjectIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export type PermissionsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Permissions"] = ResolversParentTypes["Permissions"]
> = ResolversObject<{
  listingPermissions?: Resolver<
    ResolversTypes["ListingPermissions"],
    ParentType,
    ContextType
  >;
  accountPermissions?: Resolver<
    ResolversTypes["AccountPermissions"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PhoneNumberScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["PhoneNumber"], any> {
  name: "PhoneNumber";
}

export type PhotoResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Photo"] = ResolversParentTypes["Photo"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  documentId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PointResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Point"] = ResolversParentTypes["Point"]
> = ResolversObject<{
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  coordinates?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Float"]>>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PortScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Port"], any> {
  name: "Port";
}

export interface PositiveFloatScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["PositiveFloat"], any> {
  name: "PositiveFloat";
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["PositiveInt"], any> {
  name: "PositiveInt";
}

export interface PostalCodeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["PostalCode"], any> {
  name: "PostalCode";
}

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  account?: Resolver<
    Maybe<ResolversTypes["Account"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAccountArgs, "id">
  >;
  accountGetByHandle?: Resolver<
    Maybe<ResolversTypes["Account"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAccountGetByHandleArgs, "handle">
  >;
  accounts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Account"]>>>,
    ParentType,
    ContextType
  >;
  categories?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Category"]>>>,
    ParentType,
    ContextType
  >;
  category?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCategoryArgs, "id">
  >;
  currentUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
  listing?: Resolver<
    Maybe<ResolversTypes["Listing"]>,
    ParentType,
    ContextType,
    RequireFields<QueryListingArgs, "id">
  >;
  listingSearch?: Resolver<
    Maybe<ResolversTypes["ListingSearchResult"]>,
    ParentType,
    ContextType,
    RequireFields<QueryListingSearchArgs, "input">
  >;
  listings?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Listing"]>>>,
    ParentType,
    ContextType
  >;
  listingsByAccountHandle?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Listing"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryListingsByAccountHandleArgs, "handle">
  >;
  listingsForAccount?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Listing"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryListingsForAccountArgs, "accountId">
  >;
  user?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, "id">
  >;
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
}>;

export interface RgbScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["RGB"], any> {
  name: "RGB";
}

export interface RgbaScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["RGBA"], any> {
  name: "RGBA";
}

export type RoleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Role"] = ResolversParentTypes["Role"]
> = ResolversObject<{
  roleName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  isDefault?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  permissions?: Resolver<
    ResolversTypes["Permissions"],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface SafeIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["SafeInt"], any> {
  name: "SafeInt";
}

export interface TimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Time"], any> {
  name: "Time";
}

export interface TimestampScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Timestamp"], any> {
  name: "Timestamp";
}

export interface UrlScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["URL"], any> {
  name: "URL";
}

export interface UsCurrencyScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["USCurrency"], any> {
  name: "USCurrency";
}

export interface UuidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["UUID"], any> {
  name: "UUID";
}

export interface UnsignedFloatScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["UnsignedFloat"], any> {
  name: "UnsignedFloat";
}

export interface UnsignedIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["UnsignedInt"], any> {
  name: "UnsignedInt";
}

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = ResolversObject<{
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email?: Resolver<
    Maybe<ResolversTypes["EmailAddress"]>,
    ParentType,
    ContextType
  >;
  externalId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCreateAuthHeaderForProfilePhotoOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["UserCreateAuthHeaderForProfilePhotoOutput"] = ResolversParentTypes["UserCreateAuthHeaderForProfilePhotoOutput"]
> = ResolversObject<{
  authHeader?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  blobName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  requestDate?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  isAuthorized?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  errorMessage?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UtcOffsetScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["UtcOffset"], any> {
  name: "UtcOffset";
}

export interface VoidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Void"], any> {
  name: "Void";
}

export type Resolvers<ContextType = Context> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  AccountPermissions?: AccountPermissionsResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  Byte?: GraphQLScalarType;
  Category?: CategoryResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  CreateListingPayload?: CreateListingPayloadResolvers<ContextType>;
  Currency?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Draft?: DraftResolvers<ContextType>;
  DraftAuthHeaderForDraftPhotoOutput?: DraftAuthHeaderForDraftPhotoOutputResolvers<ContextType>;
  DraftRemovePhotoResult?: DraftRemovePhotoResultResolvers<ContextType>;
  DraftStatus?: DraftStatusResolvers<ContextType>;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  FacetDetail?: FacetDetailResolvers<ContextType>;
  GUID?: GraphQLScalarType;
  HSL?: GraphQLScalarType;
  HSLA?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Hexadecimal?: GraphQLScalarType;
  IBAN?: GraphQLScalarType;
  IPv4?: GraphQLScalarType;
  IPv6?: GraphQLScalarType;
  ISBN?: GraphQLScalarType;
  ISO8601Duration?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  JWT?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  Listing?: ListingResolvers<ContextType>;
  ListingMutationResult?: ListingMutationResultResolvers<ContextType>;
  ListingMutationStatus?: ListingMutationStatusResolvers<ContextType>;
  ListingPermissions?: ListingPermissionsResolvers<ContextType>;
  ListingSearchFacets?: ListingSearchFacetsResolvers<ContextType>;
  ListingSearchResult?: ListingSearchResultResolvers<ContextType>;
  LocalDate?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Location?: LocationResolvers<ContextType>;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  MongoBase?: MongoBaseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  Permissions?: PermissionsResolvers<ContextType>;
  PhoneNumber?: GraphQLScalarType;
  Photo?: PhotoResolvers<ContextType>;
  Point?: PointResolvers<ContextType>;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  Role?: RoleResolvers<ContextType>;
  SafeInt?: GraphQLScalarType;
  Time?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  USCurrency?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  UnsignedFloat?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserCreateAuthHeaderForProfilePhotoOutput?: UserCreateAuthHeaderForProfilePhotoOutputResolvers<ContextType>;
  UtcOffset?: GraphQLScalarType;
  Void?: GraphQLScalarType;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  cacheControl22?: CacheControl22DirectiveResolver<any, any, ContextType>;
}>;
