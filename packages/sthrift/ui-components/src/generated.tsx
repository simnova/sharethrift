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

export type CancelReservationInput = {
  id: Scalars["ObjectID"]["input"];
};

export type CloseReservationInput = {
  id: Scalars["ObjectID"]["input"];
};

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

export type ConversationCreateInput = {
  listingId: Scalars["ObjectID"]["input"];
  reserverId: Scalars["ObjectID"]["input"];
  sharerId: Scalars["ObjectID"]["input"];
};

export type ConversationMutationResult = MutationResult & {
  __typename?: "ConversationMutationResult";
  conversation?: Maybe<Conversation>;
  status: MutationStatus;
};

export type CreateItemListingInput = {
  category: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isDraft?: InputMaybe<Scalars["Boolean"]["input"]>;
  location: Scalars["String"]["input"];
  sharingPeriodEnd: Scalars["DateTime"]["input"];
  sharingPeriodStart: Scalars["DateTime"]["input"];
  title: Scalars["String"]["input"];
};

export type CreateReservationRequestInput = {
  listingId: Scalars["ObjectID"]["input"];
  reservationPeriodEnd: Scalars["DateTime"]["input"];
  reservationPeriodStart: Scalars["DateTime"]["input"];
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
  sharer: User;
  sharingHistory?: Maybe<Array<Scalars["String"]["output"]>>;
  sharingPeriodEnd: Scalars["DateTime"]["output"];
  sharingPeriodStart: Scalars["DateTime"]["output"];
  state?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type Listing = ItemListing;

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
  cancelReservation: ReservationRequest;
  closeReservation: ReservationRequest;
  createConversation: ConversationMutationResult;
  createItemListing: ItemListing;
  createReservationRequest: ReservationRequest;
  personalUserUpdate: PersonalUser;
  processPayment: PaymentResponse;
  refundPayment: RefundResponse;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCancelReservationArgs = {
  input: CancelReservationInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCloseReservationArgs = {
  input: CloseReservationInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCreateConversationArgs = {
  input: ConversationCreateInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCreateItemListingArgs = {
  input: CreateItemListingInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationCreateReservationRequestArgs = {
  input: CreateReservationRequestInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationPersonalUserUpdateArgs = {
  input: PersonalUserUpdateInput;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationProcessPaymentArgs = {
  request: PaymentRequest;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type MutationRefundPaymentArgs = {
  request: RefundRequest;
};

export type MutationResult = {
  status: MutationStatus;
};

export type MutationStatus = {
  __typename?: "MutationStatus";
  errorMessage?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export type PaymentAmountDetails = {
  currency: Scalars["String"]["input"];
  totalAmount: Scalars["Float"]["input"];
};

export type PaymentBillTo = {
  address1: Scalars["String"]["input"];
  address2?: InputMaybe<Scalars["String"]["input"]>;
  city: Scalars["String"]["input"];
  country: Scalars["String"]["input"];
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  postalCode: Scalars["String"]["input"];
  state: Scalars["String"]["input"];
};

export type PaymentCard = {
  expirationMonth: Scalars["String"]["input"];
  expirationYear: Scalars["String"]["input"];
  number: Scalars["String"]["input"];
  securityCode: Scalars["String"]["input"];
};

export type PaymentCardInformation = {
  card: PaymentCard;
};

export type PaymentErrorInformation = {
  __typename?: "PaymentErrorInformation";
  message?: Maybe<Scalars["String"]["output"]>;
  reason?: Maybe<Scalars["String"]["output"]>;
};

export type PaymentOrderInformation = {
  amountDetails: PaymentAmountDetails;
  billTo: PaymentBillTo;
};

export type PaymentRequest = {
  orderInformation: PaymentOrderInformation;
  paymentInformation: PaymentCardInformation;
  userId: Scalars["ObjectID"]["input"];
};

export type PaymentResponse = {
  __typename?: "PaymentResponse";
  errorInformation?: Maybe<PaymentErrorInformation>;
  id?: Maybe<Scalars["String"]["output"]>;
  message?: Maybe<Scalars["String"]["output"]>;
  orderInformation?: Maybe<PaymentResponseOrderInformation>;
  status: Scalars["String"]["output"];
  success?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PaymentResponseAmountDetails = {
  __typename?: "PaymentResponseAmountDetails";
  currency?: Maybe<Scalars["String"]["output"]>;
  totalAmount?: Maybe<Scalars["String"]["output"]>;
};

export type PaymentResponseOrderInformation = {
  __typename?: "PaymentResponseOrderInformation";
  amountDetails?: Maybe<PaymentResponseAmountDetails>;
};

export type PersonalUser = MongoBase & {
  __typename?: "PersonalUser";
  account?: Maybe<PersonalUserAccount>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  hasCompletedOnboarding?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ObjectID"]["output"];
  isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
  role?: Maybe<PersonalUserRole>;
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
  lastPaymentAmount?: Maybe<Scalars["Float"]["output"]>;
  lastTransactionId?: Maybe<Scalars["String"]["output"]>;
  paymentState?: Maybe<Scalars["String"]["output"]>;
  subscriptionId?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountProfileBillingUpdateInput = {
  cybersourceCustomerId?: InputMaybe<Scalars["String"]["input"]>;
  lastPaymentAmount?: InputMaybe<Scalars["Float"]["input"]>;
  lastTransactionId?: InputMaybe<Scalars["String"]["input"]>;
  paymentState?: InputMaybe<Scalars["String"]["input"]>;
  subscriptionId?: InputMaybe<Scalars["String"]["input"]>;
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
  profile?: InputMaybe<PersonalUserAccountProfileUpdateInput>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserRole = MongoBase & {
  __typename?: "PersonalUserRole";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ObjectID"]["output"];
  isDefault?: Maybe<Scalars["Boolean"]["output"]>;
  permissions?: Maybe<PersonalUserRolePermissions>;
  roleName?: Maybe<Scalars["String"]["output"]>;
  roleType?: Maybe<Scalars["String"]["output"]>;
  schemaVersion?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type PersonalUserRoleConversationPermissions = {
  __typename?: "PersonalUserRoleConversationPermissions";
  canCreateConversation?: Maybe<Scalars["Boolean"]["output"]>;
  canManageConversation?: Maybe<Scalars["Boolean"]["output"]>;
  canViewConversation?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PersonalUserRoleListingPermissions = {
  __typename?: "PersonalUserRoleListingPermissions";
  canCreateItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  canDeleteItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  canPublishItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  canUnpublishItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  canUpdateItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  canViewItemListing?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PersonalUserRolePermissions = {
  __typename?: "PersonalUserRolePermissions";
  conversationPermissions?: Maybe<PersonalUserRoleConversationPermissions>;
  listingPermissions?: Maybe<PersonalUserRoleListingPermissions>;
  reservationRequestPermissions?: Maybe<PersonalUserRoleReservationRequestPermissions>;
};

export type PersonalUserRoleReservationRequestPermissions = {
  __typename?: "PersonalUserRoleReservationRequestPermissions";
  canCreateReservationRequest?: Maybe<Scalars["Boolean"]["output"]>;
  canManageReservationRequest?: Maybe<Scalars["Boolean"]["output"]>;
  canViewReservationRequest?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PersonalUserUpdateInput = {
  account?: InputMaybe<PersonalUserAccountUpdateInput>;
  id: Scalars["ObjectID"]["input"];
  isBlocked?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type Query = {
  __typename?: "Query";
  /** IGNORE: Dummy field necessary for the Query type to be valid */
  _empty?: Maybe<Scalars["String"]["output"]>;
  conversation?: Maybe<Conversation>;
  conversationsByUser?: Maybe<Array<Maybe<Conversation>>>;
  currentPersonalUserAndCreateIfNotExists: PersonalUser;
  itemListing?: Maybe<ItemListing>;
  itemListings: Array<ItemListing>;
  myActiveReservationForListing?: Maybe<ReservationRequest>;
  myActiveReservations: Array<ReservationRequest>;
  myListingsAll: ListingAllPage;
  myListingsRequests: ListingRequestPage;
  myPastReservations: Array<ReservationRequest>;
  overlapActiveReservationRequestsForListing: Array<ReservationRequest>;
  personalUserById?: Maybe<PersonalUser>;
  queryActiveByListingId: Array<Maybe<ReservationRequest>>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryConversationArgs = {
  conversationId: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryConversationsByUserArgs = {
  userId: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryItemListingArgs = {
  id: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryMyActiveReservationForListingArgs = {
  listingId: Scalars["ObjectID"]["input"];
  userId: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryMyActiveReservationsArgs = {
  userId: Scalars["ObjectID"]["input"];
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
  searchText: Scalars["String"]["input"];
  sharerId: Scalars["ObjectID"]["input"];
  sorter: SorterInput;
  statusFilters: Array<Scalars["String"]["input"]>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryMyPastReservationsArgs = {
  userId: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryOverlapActiveReservationRequestsForListingArgs = {
  listingId: Scalars["ObjectID"]["input"];
  reservationPeriodEnd: Scalars["DateTime"]["input"];
  reservationPeriodStart: Scalars["DateTime"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryPersonalUserByIdArgs = {
  id: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryQueryActiveByListingIdArgs = {
  listingId: Scalars["ObjectID"]["input"];
};

export type RefundOrderInformation = {
  amountDetails: PaymentAmountDetails;
};

export type RefundRequest = {
  amount?: InputMaybe<Scalars["Float"]["input"]>;
  orderInformation: RefundOrderInformation;
  transactionId: Scalars["String"]["input"];
  userId: Scalars["ObjectID"]["input"];
};

export type RefundResponse = {
  __typename?: "RefundResponse";
  errorInformation?: Maybe<PaymentErrorInformation>;
  id?: Maybe<Scalars["String"]["output"]>;
  message?: Maybe<Scalars["String"]["output"]>;
  orderInformation?: Maybe<PaymentResponseOrderInformation>;
  status: Scalars["String"]["output"];
  success?: Maybe<Scalars["Boolean"]["output"]>;
};

export type ReservationRequest = {
  __typename?: "ReservationRequest";
  closeRequestedByReserver?: Maybe<Scalars["Boolean"]["output"]>;
  closeRequestedBySharer?: Maybe<Scalars["Boolean"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ObjectID"]["output"];
  listing?: Maybe<ItemListing>;
  reservationPeriodEnd?: Maybe<Scalars["DateTime"]["output"]>;
  reservationPeriodStart?: Maybe<Scalars["DateTime"]["output"]>;
  reserver?: Maybe<PersonalUser>;
  state?: Maybe<ReservationRequestState>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ReservationRequestMutationResult = MutationResult & {
  __typename?: "ReservationRequestMutationResult";
  reservationRequest?: Maybe<ReservationRequest>;
  status: MutationStatus;
};

export type ReservationRequestState =
  | "Accepted"
  | "Cancelled"
  | "Closed"
  | "Rejected"
  | "Requested";

export type SorterInput = {
  field: Scalars["String"]["input"];
  order: Scalars["String"]["input"];
};

export type User = PersonalUser;

export type DummyGraphqlQueryVariables = Exact<{ [key: string]: never }>;

export type DummyGraphqlQuery = {
  __typename?: "Query";
  itemListings: Array<{ __typename?: "ItemListing"; id: any }>;
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
