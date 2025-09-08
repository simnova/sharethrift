import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AccountNumber: { input: any; output: any };
  BigInt: { input: any; output: any };
  Byte: { input: any; output: any };
  CountryCode: { input: any; output: any };
  CountryName: { input: any; output: any };
  Cuid: { input: any; output: any };
  Currency: { input: any; output: any };
  DID: { input: any; output: any };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
  DateTimeISO: { input: any; output: any };
  DeweyDecimal: { input: any; output: any };
  Duration: { input: any; output: any };
  EmailAddress: { input: any; output: any };
  GUID: { input: any; output: any };
  GeoJSON: { input: any; output: any };
  HSL: { input: any; output: any };
  HSLA: { input: any; output: any };
  HexColorCode: { input: any; output: any };
  Hexadecimal: { input: any; output: any };
  IBAN: { input: any; output: any };
  IP: { input: any; output: any };
  IPCPatent: { input: any; output: any };
  IPv4: { input: any; output: any };
  IPv6: { input: any; output: any };
  ISBN: { input: any; output: any };
  ISO8601Duration: { input: any; output: any };
  JSON: { input: any; output: any };
  JSONObject: { input: any; output: any };
  JWT: { input: any; output: any };
  LCCSubclass: { input: any; output: any };
  Latitude: { input: any; output: any };
  LocalDate: { input: any; output: any };
  LocalDateTime: { input: any; output: any };
  LocalEndTime: { input: any; output: any };
  LocalTime: { input: any; output: any };
  Locale: { input: any; output: any };
  Long: { input: any; output: any };
  Longitude: { input: any; output: any };
  MAC: { input: any; output: any };
  NegativeFloat: { input: any; output: any };
  NegativeInt: { input: any; output: any };
  NonEmptyString: { input: any; output: any };
  NonNegativeFloat: { input: any; output: any };
  NonNegativeInt: { input: any; output: any };
  NonPositiveFloat: { input: any; output: any };
  NonPositiveInt: { input: any; output: any };
  ObjectID: { input: any; output: any };
  PhoneNumber: { input: any; output: any };
  Port: { input: any; output: any };
  PositiveFloat: { input: any; output: any };
  PositiveInt: { input: any; output: any };
  PostalCode: { input: any; output: any };
  RGB: { input: any; output: any };
  RGBA: { input: any; output: any };
  RoutingNumber: { input: any; output: any };
  SESSN: { input: any; output: any };
  SafeInt: { input: any; output: any };
  SemVer: { input: any; output: any };
  Time: { input: any; output: any };
  TimeZone: { input: any; output: any };
  Timestamp: { input: any; output: any };
  URL: { input: any; output: any };
  USCurrency: { input: any; output: any };
  UUID: { input: any; output: any };
  UnsignedFloat: { input: any; output: any };
  UnsignedInt: { input: any; output: any };
  UtcOffset: { input: any; output: any };
  Void: { input: any; output: any };
};

export type BlobAuthHeader = {
  __typename?: "BlobAuthHeader";
  authHeader?: Maybe<Scalars["String"]["output"]>;
  blobName?: Maybe<Scalars["String"]["output"]>;
  blobPath?: Maybe<Scalars["String"]["output"]>;
  indexTags?: Maybe<Array<Maybe<BlobIndexTag>>>;
  metadataFields?: Maybe<Array<Maybe<BlobMetadataField>>>;
  requestDate?: Maybe<Scalars["String"]["output"]>;
};

export type BlobIndexTag = {
  __typename?: "BlobIndexTag";
  name: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type BlobMetadataField = {
  __typename?: "BlobMetadataField";
  name: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

/**  Required to enable Apollo Cache Control  */
export type CacheControlScope = "PRIVATE" | "PUBLIC";

/** GraphQL schema for Conversations */
export type Conversation = MongoBase & {
  __typename?: "Conversation";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ObjectID"]["output"];
  listing: Listing;
  reserver: User;
  schemaVersion: Scalars["String"]["output"];
  sharer: User;
  twilioConversationId: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type ItemListing = MongoBase & {
  __typename?: "ItemListing";
  category: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  id: Scalars["ObjectID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  location: Scalars["String"]["output"];
  reports?: Maybe<Scalars["Int"]["output"]>;
  schemaVersion?: Maybe<Scalars["String"]["output"]>;
  sharer: Scalars["String"]["output"];
  sharingHistory?: Maybe<Array<Scalars["String"]["output"]>>;
  sharingPeriodEnd: Scalars["DateTime"]["output"];
  sharingPeriodStart: Scalars["DateTime"]["output"];
  state?: Maybe<ItemListingState>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type ItemListingState =
  | "Appeal_Requested"
  | "Blocked"
  | "Cancelled"
  | "Drafted"
  | "Expired"
  | "Paused"
  | "Published";

export type Listing = {
  __typename?: "Listing";
  id: Scalars["ObjectID"]["output"];
};

export type ListingAll = {
  __typename?: "ListingAll";
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  pendingRequestsCount: Scalars["Int"]["output"];
  publishedAt?: Maybe<Scalars["String"]["output"]>;
  reservationPeriod?: Maybe<Scalars["String"]["output"]>;
  status: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type ListingAllPage = {
  __typename?: "ListingAllPage";
  items: Array<ListingAll>;
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
};

export type ListingRequest = {
  __typename?: "ListingRequest";
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  requestedBy: Scalars["String"]["output"];
  requestedOn: Scalars["String"]["output"];
  reservationPeriod: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type ListingRequestPage = {
  __typename?: "ListingRequestPage";
  items: Array<ListingRequest>;
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
};

/** Base type for all models in mongo. */
export type MongoBase = {
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** The ID of the object. */
  id: Scalars["ObjectID"]["output"];
  schemaVersion?: Maybe<Scalars["String"]["output"]>;
  /** Automatically generated timestamp, updated on every save. */
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

/** Base type for all models in mongo. */
export type MongoSubdocument = {
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** The ID of the object. */
  id: Scalars["ObjectID"]["output"];
  /** Automatically generated timestamp, updated on every save. */
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type Mutation = {
  __typename?: "Mutation";
  /** IGNORE: Dummy field necessary for the Mutation type to be valid */
  _empty?: Maybe<Scalars["String"]["output"]>;
};

export type MutationResult = {
  status: MutationStatus;
};

export type MutationStatus = {
  __typename?: "MutationStatus";
  errorMessage?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

/** GraphQL schema for Personal Users */
export type PersonalUser = MongoBase & {
  __typename?: "PersonalUser";
  account?: Maybe<PersonalUserAccount>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ObjectID"]["output"];
  isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
  schemaVersion?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  userType?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccount = {
  __typename?: "PersonalUserAccount";
  accountType?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  profile?: Maybe<PersonalUserAccountProfile>;
  username?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountInput = {
  accountType?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  profile?: InputMaybe<PersonalUserAccountProfileInput>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserAccountProfile = {
  __typename?: "PersonalUserAccountProfile";
  billing?: Maybe<PersonalUserAccountProfileBilling>;
  firstName?: Maybe<Scalars["String"]["output"]>;
  lastName?: Maybe<Scalars["String"]["output"]>;
  location?: Maybe<PersonalUserAccountProfileLocation>;
};

export type PersonalUserAccountProfileBilling = {
  __typename?: "PersonalUserAccountProfileBilling";
  cybersourceCustomerId?: Maybe<Scalars["String"]["output"]>;
  subscriptionId?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountProfileBillingInput = {
  cybersourceCustomerId?: InputMaybe<Scalars["String"]["input"]>;
  subscriptionId?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserAccountProfileBillingUpdateInput = {
  cybersourceCustomerId?: InputMaybe<Scalars["String"]["input"]>;
  subscriptionId?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserAccountProfileInput = {
  billing?: InputMaybe<PersonalUserAccountProfileBillingInput>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  location?: InputMaybe<PersonalUserAccountProfileLocationInput>;
};

export type PersonalUserAccountProfileLocation = {
  __typename?: "PersonalUserAccountProfileLocation";
  address1?: Maybe<Scalars["String"]["output"]>;
  address2?: Maybe<Scalars["String"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  zipCode?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountProfileLocationInput = {
  address1: Scalars["String"]["input"];
  address2?: InputMaybe<Scalars["String"]["input"]>;
  city: Scalars["String"]["input"];
  country: Scalars["String"]["input"];
  state: Scalars["String"]["input"];
  zipCode: Scalars["String"]["input"];
};

export type PersonalUserAccountProfileLocationUpdateInput = {
  address1?: InputMaybe<Scalars["String"]["input"]>;
  address2?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  zipCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserAccountProfileUpdateInput = {
  billing?: InputMaybe<PersonalUserAccountProfileBillingUpdateInput>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  location?: InputMaybe<PersonalUserAccountProfileLocationUpdateInput>;
};

export type PersonalUserAccountUpdateInput = {
  accountType?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  profile?: InputMaybe<PersonalUserAccountProfileUpdateInput>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserCreateInput = {
  account?: InputMaybe<PersonalUserAccountInput>;
  userType?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserUpdateInput = {
  account?: InputMaybe<PersonalUserAccountUpdateInput>;
  isBlocked?: InputMaybe<Scalars["Boolean"]["input"]>;
  userType?: InputMaybe<Scalars["String"]["input"]>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type Query = {
  __typename?: "Query";
  /** IGNORE: Dummy field necessary for the Query type to be valid */
  _empty?: Maybe<Scalars["String"]["output"]>;
  conversation?: Maybe<Conversation>;
  conversations: Array<Conversation>;
  currentPersonalUserAndCreateIfNotExists: PersonalUser;
  itemListing?: Maybe<ItemListing>;
  itemListings: Array<ItemListing>;
  myListingsAll: ListingAllPage;
  myListingsRequests: ListingRequestPage;
  personalUserById?: Maybe<PersonalUser>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryConversationArgs = {
  id: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryItemListingArgs = {
  id: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryMyListingsAllArgs = {
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
  searchText?: InputMaybe<Scalars["String"]["input"]>;
  sorter?: InputMaybe<SorterInput>;
  statusFilters?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryMyListingsRequestsArgs = {
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryPersonalUserByIdArgs = {
  id: Scalars["ObjectID"]["input"];
};

export type SorterInput = {
  field: Scalars["String"]["input"];
  order: Scalars["String"]["input"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ObjectID"]["output"];
  username: Scalars["String"]["output"];
};

export type DummyGraphqlQueryVariables = Exact<{ [key: string]: never }>;

export type DummyGraphqlQuery = {
  __typename?: "Query";
  itemListings: Array<{ __typename?: "ItemListing"; id: any }>;
};

export type GetListingsQueryVariables = Exact<{ [key: string]: never }>;

export type GetListingsQuery = {
  __typename?: "Query";
  itemListings: Array<{
    __typename?: "ItemListing";
    id: any;
    title: string;
    description: string;
    category: string;
    location: string;
    state?: ItemListingState | null;
    images?: Array<string> | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    sharingPeriodStart: any;
    sharingPeriodEnd: any;
    sharer: string;
    schemaVersion?: string | null;
    version?: number | null;
    reports?: number | null;
    sharingHistory?: Array<string> | null;
  }>;
};

export type ViewListingImageGalleryGetImagesQueryVariables = Exact<{
  listingId: Scalars["ObjectID"]["input"];
}>;

export type ViewListingImageGalleryGetImagesQuery = {
  __typename?: "Query";
  itemListing?: {
    __typename?: "ItemListing";
    images?: Array<string> | null;
  } | null;
};

export type ViewListingInformationGetListingQueryVariables = Exact<{
  listingId: Scalars["ObjectID"]["input"];
}>;

export type ViewListingInformationGetListingQuery = {
  __typename?: "Query";
  itemListing?: {
    __typename?: "ItemListing";
    id: any;
    title: string;
    description: string;
    category: string;
    location: string;
    sharingPeriodStart: any;
    sharingPeriodEnd: any;
    state?: ItemListingState | null;
    images?: Array<string> | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    reports?: number | null;
    sharingHistory?: Array<string> | null;
    sharer: string;
    schemaVersion?: string | null;
  } | null;
};

export type ViewListingSharerInformationGetSharerQueryVariables = Exact<{
  sharerId: Scalars["ObjectID"]["input"];
}>;

export type ViewListingSharerInformationGetSharerQuery = {
  __typename?: "Query";
  personalUserById?: {
    __typename?: "PersonalUser";
    id: any;
    userType?: string | null;
    isBlocked?: boolean | null;
    account?: {
      __typename?: "PersonalUserAccount";
      username?: string | null;
      profile?: {
        __typename?: "PersonalUserAccountProfile";
        firstName?: string | null;
        lastName?: string | null;
        location?: {
          __typename?: "PersonalUserAccountProfileLocation";
          city?: string | null;
          state?: string | null;
          country?: string | null;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type ViewListingQueryVariables = Exact<{
  id: Scalars["ObjectID"]["input"];
}>;

export type ViewListingQuery = {
  __typename?: "Query";
  itemListing?: {
    __typename?: "ItemListing";
    id: any;
    title: string;
    description: string;
    category: string;
    location: string;
    sharingPeriodStart: any;
    sharingPeriodEnd: any;
    state?: ItemListingState | null;
    images?: Array<string> | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    reports?: number | null;
    sharingHistory?: Array<string> | null;
    sharer: string;
    schemaVersion?: string | null;
  } | null;
};

export type HomeMyListingsContainerMyListingsAllQueryVariables = Exact<{
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
  searchText?: InputMaybe<Scalars["String"]["input"]>;
  statusFilters?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sorter?: InputMaybe<SorterInput>;
}>;

export type HomeMyListingsContainerMyListingsAllQuery = {
  __typename?: "Query";
  myListingsAll: {
    __typename?: "ListingAllPage";
    total: number;
    page: number;
    pageSize: number;
    items: Array<{
      __typename?: "ListingAll";
      id: string;
      title: string;
      status: string;
      image?: string | null;
      pendingRequestsCount: number;
      publishedAt?: string | null;
      reservationPeriod?: string | null;
    }>;
  };
};

export type HomeMyListingsContainerListingFieldsFragment = {
  __typename?: "ListingAll";
  id: string;
  title: string;
  status: string;
  image?: string | null;
  pendingRequestsCount: number;
  publishedAt?: string | null;
  reservationPeriod?: string | null;
};

export type SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExistsQueryVariables =
  Exact<{ [key: string]: never }>;

export type SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExistsQuery =
  {
    __typename?: "Query";
    currentPersonalUserAndCreateIfNotExists: {
      __typename?: "PersonalUser";
      id: any;
      account?: {
        __typename?: "PersonalUserAccount";
        email?: string | null;
        profile?: {
          __typename?: "PersonalUserAccountProfile";
          firstName?: string | null;
          lastName?: string | null;
        } | null;
      } | null;
    };
  };

export const HomeMyListingsContainerListingFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "HomeMyListingsContainerListingFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ListingAll" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
          { kind: "Field", name: { kind: "Name", value: "image" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "pendingRequestsCount" },
          },
          { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
          { kind: "Field", name: { kind: "Name", value: "reservationPeriod" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeMyListingsContainerListingFieldsFragment,
  unknown
>;
export const DummyGraphqlDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DummyGraphql" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "itemListings" },
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
} as unknown as DocumentNode<DummyGraphqlQuery, DummyGraphqlQueryVariables>;
export const GetListingsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetListings" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "itemListings" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "category" } },
                { kind: "Field", name: { kind: "Name", value: "location" } },
                { kind: "Field", name: { kind: "Name", value: "state" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingPeriodStart" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingPeriodEnd" },
                },
                { kind: "Field", name: { kind: "Name", value: "sharer" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "schemaVersion" },
                },
                { kind: "Field", name: { kind: "Name", value: "version" } },
                { kind: "Field", name: { kind: "Name", value: "reports" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingHistory" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetListingsQuery, GetListingsQueryVariables>;
export const ViewListingImageGalleryGetImagesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewListingImageGalleryGetImages" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "listingId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ObjectID" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "itemListing" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "listingId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "images" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ViewListingImageGalleryGetImagesQuery,
  ViewListingImageGalleryGetImagesQueryVariables
>;
export const ViewListingInformationGetListingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewListingInformationGetListing" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "listingId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ObjectID" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "itemListing" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "listingId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "category" } },
                { kind: "Field", name: { kind: "Name", value: "location" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingPeriodStart" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingPeriodEnd" },
                },
                { kind: "Field", name: { kind: "Name", value: "state" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "reports" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingHistory" },
                },
                { kind: "Field", name: { kind: "Name", value: "sharer" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "schemaVersion" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ViewListingInformationGetListingQuery,
  ViewListingInformationGetListingQueryVariables
>;
export const ViewListingSharerInformationGetSharerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewListingSharerInformationGetSharer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sharerId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ObjectID" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "personalUserById" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sharerId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "userType" } },
                { kind: "Field", name: { kind: "Name", value: "isBlocked" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "username" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "profile" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "firstName" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "lastName" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "location" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "city" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "state" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "country" },
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
      },
    },
  ],
} as unknown as DocumentNode<
  ViewListingSharerInformationGetSharerQuery,
  ViewListingSharerInformationGetSharerQueryVariables
>;
export const ViewListingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewListing" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ObjectID" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "itemListing" },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "category" } },
                { kind: "Field", name: { kind: "Name", value: "location" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingPeriodStart" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingPeriodEnd" },
                },
                { kind: "Field", name: { kind: "Name", value: "state" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "reports" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sharingHistory" },
                },
                { kind: "Field", name: { kind: "Name", value: "sharer" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "schemaVersion" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ViewListingQuery, ViewListingQueryVariables>;
export const HomeMyListingsContainerMyListingsAllDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HomeMyListingsContainerMyListingsAll" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "searchText" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "statusFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sorter" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "SorterInput" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "myListingsAll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "page" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "searchText" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "searchText" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "statusFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "statusFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sorter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sorter" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "HomeMyListingsContainerListingFields",
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "HomeMyListingsContainerListingFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ListingAll" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
          { kind: "Field", name: { kind: "Name", value: "image" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "pendingRequestsCount" },
          },
          { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
          { kind: "Field", name: { kind: "Name", value: "reservationPeriod" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeMyListingsContainerMyListingsAllQuery,
  HomeMyListingsContainerMyListingsAllQueryVariables
>;
export const SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExistsDocument =
  {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "query",
        name: {
          kind: "Name",
          value:
            "SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExists",
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            {
              kind: "Field",
              name: {
                kind: "Name",
                value: "currentPersonalUserAndCreateIfNotExists",
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
                        {
                          kind: "Field",
                          name: { kind: "Name", value: "email" },
                        },
                        {
                          kind: "Field",
                          name: { kind: "Name", value: "profile" },
                          selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                              {
                                kind: "Field",
                                name: { kind: "Name", value: "firstName" },
                              },
                              {
                                kind: "Field",
                                name: { kind: "Name", value: "lastName" },
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
    SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExistsQuery,
    SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExistsQueryVariables
  >;
