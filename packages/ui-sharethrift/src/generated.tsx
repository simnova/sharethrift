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

/** GraphQL schema for Conversations */
export type Conversation = MongoBase & {
  __typename?: "Conversation";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ObjectID"]["output"];
  listing?: Maybe<Listing>;
  reserver?: Maybe<User>;
  schemaVersion?: Maybe<Scalars["String"]["output"]>;
  sharer?: Maybe<User>;
  twilioConversationId?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
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
  cancelReservation: ReservationRequest;
  closeReservation: ReservationRequest;
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

/** GraphQL schema for Personal Users */
export type PaymentState = "FAILED" | "PENDING" | "REFUNDED" | "SUCCEEDED";

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
  paymentState?: Maybe<PaymentState>;
  subscriptionId?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountProfileBillingUpdateInput = {
  cybersourceCustomerId?: InputMaybe<Scalars["String"]["input"]>;
  lastPaymentAmount?: InputMaybe<Scalars["Float"]["input"]>;
  lastTransactionId?: InputMaybe<Scalars["String"]["input"]>;
  paymentState?: InputMaybe<PaymentState>;
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
  conversations: Array<Conversation>;
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
  id: Scalars["ObjectID"]["input"];
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
  searchText?: InputMaybe<Scalars["String"]["input"]>;
  sorter?: InputMaybe<SorterInput>;
  statusFilters?: InputMaybe<Array<Scalars["String"]["input"]>>;
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
  createdAt?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ObjectID"]["output"];
  listing?: Maybe<ItemListing>;
  reservationPeriodEnd?: Maybe<Scalars["String"]["output"]>;
  reservationPeriodStart?: Maybe<Scalars["String"]["output"]>;
  reserver?: Maybe<PersonalUser>;
  state?: Maybe<ReservationRequestState>;
  updatedAt?: Maybe<Scalars["String"]["output"]>;
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

export type HomeAccountProfileViewContainerCurrentUserQueryVariables = Exact<{
  [key: string]: never;
}>;

export type HomeAccountProfileViewContainerCurrentUserQuery = {
  __typename?: "Query";
  currentPersonalUserAndCreateIfNotExists: {
    __typename?: "PersonalUser";
    id: any;
    userType?: string | null;
    createdAt?: any | null;
    account?: {
      __typename?: "PersonalUserAccount";
      accountType?: string | null;
      email?: string | null;
      username?: string | null;
      profile?: {
        __typename?: "PersonalUserAccountProfile";
        firstName?: string | null;
        lastName?: string | null;
        location?: {
          __typename?: "PersonalUserAccountProfileLocation";
          city?: string | null;
          state?: string | null;
        } | null;
      } | null;
    } | null;
  };
};

export type HomeAccountProfileViewContainerUserListingsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type HomeAccountProfileViewContainerUserListingsQuery = {
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
    sharer: string;
    createdAt?: any | null;
    updatedAt?: any | null;
    sharingPeriodStart: any;
    sharingPeriodEnd: any;
  }>;
};

export type HomeAccountSettingsViewContainerCurrentUserQueryVariables = Exact<{
  [key: string]: never;
}>;

export type HomeAccountSettingsViewContainerCurrentUserQuery = {
  __typename?: "Query";
  currentPersonalUserAndCreateIfNotExists: {
    __typename?: "PersonalUser";
    id: any;
    userType?: string | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    account?: {
      __typename?: "PersonalUserAccount";
      accountType?: string | null;
      email?: string | null;
      username?: string | null;
      profile?: {
        __typename?: "PersonalUserAccountProfile";
        firstName?: string | null;
        lastName?: string | null;
        location?: {
          __typename?: "PersonalUserAccountProfileLocation";
          address1?: string | null;
          address2?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          zipCode?: string | null;
        } | null;
        billing?: {
          __typename?: "PersonalUserAccountProfileBilling";
          subscriptionId?: string | null;
          cybersourceCustomerId?: string | null;
        } | null;
      } | null;
    } | null;
  };
};

export type ItemListingFieldsFragment = {
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
  sharer: string;
  schemaVersion?: string | null;
};

export type HomeCreateListingContainerCreateItemListingMutationVariables =
  Exact<{
    input: CreateItemListingInput;
  }>;

export type HomeCreateListingContainerCreateItemListingMutation = {
  __typename?: "Mutation";
  createItemListing: {
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
    sharer: string;
    schemaVersion?: string | null;
  };
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

export type ViewListingQueryActiveByListingIdQueryVariables = Exact<{
  listingId: Scalars["ObjectID"]["input"];
}>;

export type ViewListingQueryActiveByListingIdQuery = {
  __typename?: "Query";
  queryActiveByListingId: Array<{
    __typename?: "ReservationRequest";
    id: any;
    state?: ReservationRequestState | null;
    reservationPeriodStart?: string | null;
    reservationPeriodEnd?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    closeRequestedBySharer?: boolean | null;
    closeRequestedByReserver?: boolean | null;
  } | null>;
};

export type HomeListingInformationCreateReservationRequestMutationVariables =
  Exact<{
    input: CreateReservationRequestInput;
  }>;

export type HomeListingInformationCreateReservationRequestMutation = {
  __typename?: "Mutation";
  createReservationRequest: {
    __typename?: "ReservationRequest";
    id: any;
    state?: ReservationRequestState | null;
    reservationPeriodStart?: string | null;
    reservationPeriodEnd?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
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

export type ViewListingCurrentUserQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ViewListingCurrentUserQuery = {
  __typename?: "Query";
  currentPersonalUserAndCreateIfNotExists: {
    __typename?: "PersonalUser";
    id: any;
  };
};

export type ViewListingActiveReservationRequestForListingQueryVariables =
  Exact<{
    listingId: Scalars["ObjectID"]["input"];
    reserverId: Scalars["ObjectID"]["input"];
  }>;

export type ViewListingActiveReservationRequestForListingQuery = {
  __typename?: "Query";
  myActiveReservationForListing?: {
    __typename?: "ReservationRequest";
    id: any;
    state?: ReservationRequestState | null;
    reservationPeriodStart?: string | null;
    reservationPeriodEnd?: string | null;
  } | null;
};

export type HomeAllListingsTableContainerMyListingsAllQueryVariables = Exact<{
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
  searchText?: InputMaybe<Scalars["String"]["input"]>;
  statusFilters?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sorter?: InputMaybe<SorterInput>;
}>;

export type HomeAllListingsTableContainerMyListingsAllQuery = {
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

export type HomeAllListingsTableContainerListingFieldsFragment = {
  __typename?: "ListingAll";
  id: string;
  title: string;
  status: string;
  image?: string | null;
  pendingRequestsCount: number;
  publishedAt?: string | null;
  reservationPeriod?: string | null;
};

export type HomeMyListingsDashboardContainerMyListingsRequestsCountQueryVariables =
  Exact<{ [key: string]: never }>;

export type HomeMyListingsDashboardContainerMyListingsRequestsCountQuery = {
  __typename?: "Query";
  myListingsRequests: { __typename?: "ListingRequestPage"; total: number };
};

export type HomeRequestsTableContainerMyListingsRequestsQueryVariables = Exact<{
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
  searchText?: InputMaybe<Scalars["String"]["input"]>;
  statusFilters?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sorter?: InputMaybe<SorterInput>;
}>;

export type HomeRequestsTableContainerMyListingsRequestsQuery = {
  __typename?: "Query";
  myListingsRequests: {
    __typename?: "ListingRequestPage";
    total: number;
    page: number;
    pageSize: number;
    items: Array<{
      __typename?: "ListingRequest";
      id: string;
      title: string;
      image?: string | null;
      requestedBy: string;
      requestedOn: string;
      reservationPeriod: string;
      status: string;
    }>;
  };
};

export type HomeRequestsTableContainerRequestFieldsFragment = {
  __typename?: "ListingRequest";
  id: string;
  title: string;
  image?: string | null;
  requestedBy: string;
  requestedOn: string;
  reservationPeriod: string;
  status: string;
};

export type ReservationsViewActiveContainerReservationFieldsFragment = {
  __typename?: "ReservationRequest";
  id: any;
  state?: ReservationRequestState | null;
  reservationPeriodStart?: string | null;
  reservationPeriodEnd?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  closeRequestedBySharer?: boolean | null;
  closeRequestedByReserver?: boolean | null;
  listing?: { __typename?: "ItemListing"; id: any; title: string } | null;
  reserver?: {
    __typename?: "PersonalUser";
    account?: {
      __typename?: "PersonalUserAccount";
      username?: string | null;
      profile?: {
        __typename?: "PersonalUserAccountProfile";
        firstName?: string | null;
        lastName?: string | null;
      } | null;
    } | null;
  } | null;
};

export type ReservationsViewActiveContainerActiveReservationsQueryVariables =
  Exact<{
    userId: Scalars["ObjectID"]["input"];
  }>;

export type ReservationsViewActiveContainerActiveReservationsQuery = {
  __typename?: "Query";
  myActiveReservations: Array<{
    __typename?: "ReservationRequest";
    id: any;
    state?: ReservationRequestState | null;
    reservationPeriodStart?: string | null;
    reservationPeriodEnd?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    closeRequestedBySharer?: boolean | null;
    closeRequestedByReserver?: boolean | null;
    listing?: { __typename?: "ItemListing"; id: any; title: string } | null;
    reserver?: {
      __typename?: "PersonalUser";
      account?: {
        __typename?: "PersonalUserAccount";
        username?: string | null;
        profile?: {
          __typename?: "PersonalUserAccountProfile";
          firstName?: string | null;
          lastName?: string | null;
        } | null;
      } | null;
    } | null;
  }>;
};

export type ReservationsViewActiveContainerCancelReservationMutationVariables =
  Exact<{
    input: CancelReservationInput;
  }>;

export type ReservationsViewActiveContainerCancelReservationMutation = {
  __typename?: "Mutation";
  cancelReservation: {
    __typename?: "ReservationRequest";
    id: any;
    state?: ReservationRequestState | null;
    updatedAt?: string | null;
    closeRequestedBySharer?: boolean | null;
    closeRequestedByReserver?: boolean | null;
  };
};

export type ReservationsViewActiveContainerCloseReservationMutationVariables =
  Exact<{
    input: CloseReservationInput;
  }>;

export type ReservationsViewActiveContainerCloseReservationMutation = {
  __typename?: "Mutation";
  closeReservation: {
    __typename?: "ReservationRequest";
    id: any;
    state?: ReservationRequestState | null;
    updatedAt?: string | null;
    closeRequestedBySharer?: boolean | null;
    closeRequestedByReserver?: boolean | null;
  };
};

export type ReservationsViewHistoryContainerReservationFieldsFragment = {
  __typename?: "ReservationRequest";
  id: any;
  state?: ReservationRequestState | null;
  reservationPeriodStart?: string | null;
  reservationPeriodEnd?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  closeRequestedBySharer?: boolean | null;
  closeRequestedByReserver?: boolean | null;
  listing?: { __typename?: "ItemListing"; id: any; title: string } | null;
  reserver?: {
    __typename?: "PersonalUser";
    id: any;
    account?: {
      __typename?: "PersonalUserAccount";
      username?: string | null;
      profile?: {
        __typename?: "PersonalUserAccountProfile";
        firstName?: string | null;
        lastName?: string | null;
      } | null;
    } | null;
  } | null;
};

export type ReservationsViewHistoryContainerPastReservationsQueryVariables =
  Exact<{
    userId: Scalars["ObjectID"]["input"];
  }>;

export type ReservationsViewHistoryContainerPastReservationsQuery = {
  __typename?: "Query";
  myPastReservations: Array<{
    __typename?: "ReservationRequest";
    id: any;
    state?: ReservationRequestState | null;
    reservationPeriodStart?: string | null;
    reservationPeriodEnd?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    closeRequestedBySharer?: boolean | null;
    closeRequestedByReserver?: boolean | null;
    listing?: { __typename?: "ItemListing"; id: any; title: string } | null;
    reserver?: {
      __typename?: "PersonalUser";
      id: any;
      account?: {
        __typename?: "PersonalUserAccount";
        username?: string | null;
        profile?: {
          __typename?: "PersonalUserAccountProfile";
          firstName?: string | null;
          lastName?: string | null;
        } | null;
      } | null;
    } | null;
  }>;
};

export type SignupSelectAccountTypePersonalUserUpdateMutationVariables = Exact<{
  input: PersonalUserUpdateInput;
}>;

export type SignupSelectAccountTypePersonalUserUpdateMutation = {
  __typename?: "Mutation";
  personalUserUpdate: {
    __typename?: "PersonalUser";
    id: any;
    schemaVersion?: string | null;
    createdAt?: any | null;
    updatedAt?: any | null;
    account?: {
      __typename?: "PersonalUserAccount";
      accountType?: string | null;
    } | null;
  };
};

export type SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsQueryVariables =
  Exact<{ [key: string]: never }>;

export type SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsQuery =
  {
    __typename?: "Query";
    currentPersonalUserAndCreateIfNotExists: {
      __typename?: "PersonalUser";
      id: any;
      account?: {
        __typename?: "PersonalUserAccount";
        accountType?: string | null;
      } | null;
    };
  };

export const ItemListingFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ItemListingFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ItemListing" },
      },
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
          { kind: "Field", name: { kind: "Name", value: "sharingPeriodEnd" } },
          { kind: "Field", name: { kind: "Name", value: "state" } },
          { kind: "Field", name: { kind: "Name", value: "images" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          { kind: "Field", name: { kind: "Name", value: "sharer" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ItemListingFieldsFragment, unknown>;
export const HomeAllListingsTableContainerListingFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "HomeAllListingsTableContainerListingFields",
      },
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
  HomeAllListingsTableContainerListingFieldsFragment,
  unknown
>;
export const HomeRequestsTableContainerRequestFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "HomeRequestsTableContainerRequestFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ListingRequest" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "image" } },
          { kind: "Field", name: { kind: "Name", value: "requestedBy" } },
          { kind: "Field", name: { kind: "Name", value: "requestedOn" } },
          { kind: "Field", name: { kind: "Name", value: "reservationPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeRequestsTableContainerRequestFieldsFragment,
  unknown
>;
export const ReservationsViewActiveContainerReservationFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "ReservationsViewActiveContainerReservationFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ReservationRequest" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "state" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodStart" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodEnd" },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "listing" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reserver" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
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
            name: { kind: "Name", value: "closeRequestedBySharer" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "closeRequestedByReserver" },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReservationsViewActiveContainerReservationFieldsFragment,
  unknown
>;
export const ReservationsViewHistoryContainerReservationFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "ReservationsViewHistoryContainerReservationFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ReservationRequest" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "state" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodStart" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodEnd" },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "listing" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reserver" },
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
            name: { kind: "Name", value: "closeRequestedBySharer" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "closeRequestedByReserver" },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReservationsViewHistoryContainerReservationFieldsFragment,
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
export const HomeAccountProfileViewContainerCurrentUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "HomeAccountProfileViewContainerCurrentUser",
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
                { kind: "Field", name: { kind: "Name", value: "userType" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "accountType" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
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
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeAccountProfileViewContainerCurrentUserQuery,
  HomeAccountProfileViewContainerCurrentUserQueryVariables
>;
export const HomeAccountProfileViewContainerUserListingsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "HomeAccountProfileViewContainerUserListings",
      },
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
                { kind: "Field", name: { kind: "Name", value: "sharer" } },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeAccountProfileViewContainerUserListingsQuery,
  HomeAccountProfileViewContainerUserListingsQueryVariables
>;
export const HomeAccountSettingsViewContainerCurrentUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "HomeAccountSettingsViewContainerCurrentUser",
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
                { kind: "Field", name: { kind: "Name", value: "userType" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "accountType" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
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
                                    name: { kind: "Name", value: "address1" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "address2" },
                                  },
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
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "zipCode" },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "billing" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "subscriptionId",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "cybersourceCustomerId",
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
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeAccountSettingsViewContainerCurrentUserQuery,
  HomeAccountSettingsViewContainerCurrentUserQueryVariables
>;
export const HomeCreateListingContainerCreateItemListingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "HomeCreateListingContainerCreateItemListing",
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
              name: { kind: "Name", value: "CreateItemListingInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createItemListing" },
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
                  name: { kind: "Name", value: "ItemListingFields" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ItemListingFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ItemListing" },
      },
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
          { kind: "Field", name: { kind: "Name", value: "sharingPeriodEnd" } },
          { kind: "Field", name: { kind: "Name", value: "state" } },
          { kind: "Field", name: { kind: "Name", value: "images" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          { kind: "Field", name: { kind: "Name", value: "sharer" } },
          { kind: "Field", name: { kind: "Name", value: "schemaVersion" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeCreateListingContainerCreateItemListingMutation,
  HomeCreateListingContainerCreateItemListingMutationVariables
>;
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
export const ViewListingQueryActiveByListingIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewListingQueryActiveByListingId" },
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
            name: { kind: "Name", value: "queryActiveByListingId" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "listingId" },
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
                { kind: "Field", name: { kind: "Name", value: "state" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reservationPeriodStart" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reservationPeriodEnd" },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "closeRequestedBySharer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "closeRequestedByReserver" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ViewListingQueryActiveByListingIdQuery,
  ViewListingQueryActiveByListingIdQueryVariables
>;
export const HomeListingInformationCreateReservationRequestDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "HomeListingInformationCreateReservationRequest",
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
              name: { kind: "Name", value: "CreateReservationRequestInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createReservationRequest" },
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
                { kind: "Field", name: { kind: "Name", value: "state" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reservationPeriodStart" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reservationPeriodEnd" },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeListingInformationCreateReservationRequestMutation,
  HomeListingInformationCreateReservationRequestMutationVariables
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
export const ViewListingCurrentUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewListingCurrentUser" },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ViewListingCurrentUserQuery,
  ViewListingCurrentUserQueryVariables
>;
export const ViewListingActiveReservationRequestForListingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "ViewListingActiveReservationRequestForListing",
      },
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
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "reserverId" },
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
            name: { kind: "Name", value: "myActiveReservationForListing" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "listingId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "listingId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "reserverId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "state" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reservationPeriodStart" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reservationPeriodEnd" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ViewListingActiveReservationRequestForListingQuery,
  ViewListingActiveReservationRequestForListingQueryVariables
>;
export const HomeAllListingsTableContainerMyListingsAllDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "HomeAllListingsTableContainerMyListingsAll",
      },
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
                          value: "HomeAllListingsTableContainerListingFields",
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
      name: {
        kind: "Name",
        value: "HomeAllListingsTableContainerListingFields",
      },
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
  HomeAllListingsTableContainerMyListingsAllQuery,
  HomeAllListingsTableContainerMyListingsAllQueryVariables
>;
export const HomeMyListingsDashboardContainerMyListingsRequestsCountDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "HomeMyListingsDashboardContainerMyListingsRequestsCount",
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "myListingsRequests" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "IntValue", value: "1" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "IntValue", value: "1" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "total" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeMyListingsDashboardContainerMyListingsRequestsCountQuery,
  HomeMyListingsDashboardContainerMyListingsRequestsCountQueryVariables
>;
export const HomeRequestsTableContainerMyListingsRequestsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "HomeRequestsTableContainerMyListingsRequests",
      },
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
            name: { kind: "Name", value: "myListingsRequests" },
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
                          value: "HomeRequestsTableContainerRequestFields",
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
      name: { kind: "Name", value: "HomeRequestsTableContainerRequestFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ListingRequest" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "image" } },
          { kind: "Field", name: { kind: "Name", value: "requestedBy" } },
          { kind: "Field", name: { kind: "Name", value: "requestedOn" } },
          { kind: "Field", name: { kind: "Name", value: "reservationPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HomeRequestsTableContainerMyListingsRequestsQuery,
  HomeRequestsTableContainerMyListingsRequestsQueryVariables
>;
export const ReservationsViewActiveContainerActiveReservationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "ReservationsViewActiveContainerActiveReservations",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
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
            name: { kind: "Name", value: "myActiveReservations" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
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
                  name: {
                    kind: "Name",
                    value: "ReservationsViewActiveContainerReservationFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "ReservationsViewActiveContainerReservationFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ReservationRequest" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "state" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodStart" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodEnd" },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "listing" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reserver" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
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
            name: { kind: "Name", value: "closeRequestedBySharer" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "closeRequestedByReserver" },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReservationsViewActiveContainerActiveReservationsQuery,
  ReservationsViewActiveContainerActiveReservationsQueryVariables
>;
export const ReservationsViewActiveContainerCancelReservationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "ReservationsViewActiveContainerCancelReservation",
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
              name: { kind: "Name", value: "CancelReservationInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cancelReservation" },
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
                { kind: "Field", name: { kind: "Name", value: "state" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "closeRequestedBySharer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "closeRequestedByReserver" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReservationsViewActiveContainerCancelReservationMutation,
  ReservationsViewActiveContainerCancelReservationMutationVariables
>;
export const ReservationsViewActiveContainerCloseReservationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "ReservationsViewActiveContainerCloseReservation",
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
              name: { kind: "Name", value: "CloseReservationInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "closeReservation" },
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
                { kind: "Field", name: { kind: "Name", value: "state" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "closeRequestedBySharer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "closeRequestedByReserver" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReservationsViewActiveContainerCloseReservationMutation,
  ReservationsViewActiveContainerCloseReservationMutationVariables
>;
export const ReservationsViewHistoryContainerPastReservationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: {
        kind: "Name",
        value: "ReservationsViewHistoryContainerPastReservations",
      },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
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
            name: { kind: "Name", value: "myPastReservations" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
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
                  name: {
                    kind: "Name",
                    value: "ReservationsViewHistoryContainerReservationFields",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: {
        kind: "Name",
        value: "ReservationsViewHistoryContainerReservationFields",
      },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ReservationRequest" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "state" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodStart" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationPeriodEnd" },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "listing" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "reserver" },
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
            name: { kind: "Name", value: "closeRequestedBySharer" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "closeRequestedByReserver" },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReservationsViewHistoryContainerPastReservationsQuery,
  ReservationsViewHistoryContainerPastReservationsQueryVariables
>;
export const SignupSelectAccountTypePersonalUserUpdateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "SignupSelectAccountTypePersonalUserUpdate",
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
              name: { kind: "Name", value: "PersonalUserUpdateInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "personalUserUpdate" },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "schemaVersion" },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "account" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "accountType" },
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
  SignupSelectAccountTypePersonalUserUpdateMutation,
  SignupSelectAccountTypePersonalUserUpdateMutationVariables
>;
export const SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument =
  {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "query",
        name: {
          kind: "Name",
          value:
            "SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExists",
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
                          name: { kind: "Name", value: "accountType" },
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
    SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsQuery,
    SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsQueryVariables
  >;
