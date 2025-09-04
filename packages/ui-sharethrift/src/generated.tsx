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
export type QueryPersonalUserByIdArgs = {
  id: Scalars["ObjectID"]["input"];
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
