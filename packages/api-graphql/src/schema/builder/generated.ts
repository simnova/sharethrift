import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
import type { GraphContext } from "../../init/context.ts";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  Date: { input: Date; output: Date };
  DateTime: { input: any; output: any };
  DateTimeISO: { input: any; output: any };
  DeweyDecimal: { input: any; output: any };
  Duration: { input: any; output: any };
  EmailAddress: { input: string; output: string };
  GUID: { input: string; output: string };
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

export type ItemListingState = "Appeal_Requested" | "Blocked" | "Cancelled" | "Drafted" | "Expired" | "Paused" | "Published";

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
  cancelReservation: ReservationRequest;
  closeReservation: ReservationRequest;
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
  myActiveReservations: Array<ReservationRequest>;
  myPastReservations: Array<ReservationRequest>;
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
export type QueryMyActiveReservationsArgs = {
  userId: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryMyPastReservationsArgs = {
  userId: Scalars["ObjectID"]["input"];
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryPersonalUserByIdArgs = {
  id: Scalars["ObjectID"]["input"];
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
  closeRequestedByReserver: Scalars["Boolean"]["output"];
  closeRequestedBySharer: Scalars["Boolean"]["output"];
  createdAt: Scalars["String"]["output"];
  id: Scalars["ObjectID"]["output"];
  listing: ItemListing;
  reservationPeriodEnd: Scalars["String"]["output"];
  reservationPeriodStart: Scalars["String"]["output"];
  reserver: PersonalUser;
  state: ReservationRequestState;
  updatedAt: Scalars["String"]["output"];
};

export type ReservationRequestMutationResult = MutationResult & {
  __typename?: "ReservationRequestMutationResult";
  reservationRequest?: Maybe<ReservationRequest>;
  status: MutationStatus;
};

export type ReservationRequestState = "Accepted" | "Cancelled" | "Closed" | "Rejected" | "Requested";

export type User = {
  __typename?: "User";
  id: Scalars["ObjectID"]["output"];
  username: Scalars["String"]["output"];
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
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  MongoBase: Conversation | ItemListing | PersonalUser;
  MongoSubdocument: never;
  MutationResult: ReservationRequestMutationResult;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountNumber: ResolverTypeWrapper<Scalars["AccountNumber"]["output"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]["output"]>;
  BlobAuthHeader: ResolverTypeWrapper<BlobAuthHeader>;
  BlobIndexTag: ResolverTypeWrapper<BlobIndexTag>;
  BlobMetadataField: ResolverTypeWrapper<BlobMetadataField>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Byte: ResolverTypeWrapper<Scalars["Byte"]["output"]>;
  CacheControlScope: CacheControlScope;
  CancelReservationInput: CancelReservationInput;
  CloseReservationInput: CloseReservationInput;
  Conversation: ResolverTypeWrapper<Conversation>;
  CountryCode: ResolverTypeWrapper<Scalars["CountryCode"]["output"]>;
  CountryName: ResolverTypeWrapper<Scalars["CountryName"]["output"]>;
  Cuid: ResolverTypeWrapper<Scalars["Cuid"]["output"]>;
  Currency: ResolverTypeWrapper<Scalars["Currency"]["output"]>;
  DID: ResolverTypeWrapper<Scalars["DID"]["output"]>;
  Date: ResolverTypeWrapper<Scalars["Date"]["output"]>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]["output"]>;
  DateTimeISO: ResolverTypeWrapper<Scalars["DateTimeISO"]["output"]>;
  DeweyDecimal: ResolverTypeWrapper<Scalars["DeweyDecimal"]["output"]>;
  Duration: ResolverTypeWrapper<Scalars["Duration"]["output"]>;
  EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]["output"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  GUID: ResolverTypeWrapper<Scalars["GUID"]["output"]>;
  GeoJSON: ResolverTypeWrapper<Scalars["GeoJSON"]["output"]>;
  HSL: ResolverTypeWrapper<Scalars["HSL"]["output"]>;
  HSLA: ResolverTypeWrapper<Scalars["HSLA"]["output"]>;
  HexColorCode: ResolverTypeWrapper<Scalars["HexColorCode"]["output"]>;
  Hexadecimal: ResolverTypeWrapper<Scalars["Hexadecimal"]["output"]>;
  IBAN: ResolverTypeWrapper<Scalars["IBAN"]["output"]>;
  IP: ResolverTypeWrapper<Scalars["IP"]["output"]>;
  IPCPatent: ResolverTypeWrapper<Scalars["IPCPatent"]["output"]>;
  IPv4: ResolverTypeWrapper<Scalars["IPv4"]["output"]>;
  IPv6: ResolverTypeWrapper<Scalars["IPv6"]["output"]>;
  ISBN: ResolverTypeWrapper<Scalars["ISBN"]["output"]>;
  ISO8601Duration: ResolverTypeWrapper<Scalars["ISO8601Duration"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  ItemListing: ResolverTypeWrapper<ItemListing>;
  ItemListingState: ItemListingState;
  JSON: ResolverTypeWrapper<Scalars["JSON"]["output"]>;
  JSONObject: ResolverTypeWrapper<Scalars["JSONObject"]["output"]>;
  JWT: ResolverTypeWrapper<Scalars["JWT"]["output"]>;
  LCCSubclass: ResolverTypeWrapper<Scalars["LCCSubclass"]["output"]>;
  Latitude: ResolverTypeWrapper<Scalars["Latitude"]["output"]>;
  Listing: ResolverTypeWrapper<Listing>;
  LocalDate: ResolverTypeWrapper<Scalars["LocalDate"]["output"]>;
  LocalDateTime: ResolverTypeWrapper<Scalars["LocalDateTime"]["output"]>;
  LocalEndTime: ResolverTypeWrapper<Scalars["LocalEndTime"]["output"]>;
  LocalTime: ResolverTypeWrapper<Scalars["LocalTime"]["output"]>;
  Locale: ResolverTypeWrapper<Scalars["Locale"]["output"]>;
  Long: ResolverTypeWrapper<Scalars["Long"]["output"]>;
  Longitude: ResolverTypeWrapper<Scalars["Longitude"]["output"]>;
  MAC: ResolverTypeWrapper<Scalars["MAC"]["output"]>;
  MongoBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["MongoBase"]>;
  MongoSubdocument: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["MongoSubdocument"]>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationResult: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["MutationResult"]>;
  MutationStatus: ResolverTypeWrapper<MutationStatus>;
  NegativeFloat: ResolverTypeWrapper<Scalars["NegativeFloat"]["output"]>;
  NegativeInt: ResolverTypeWrapper<Scalars["NegativeInt"]["output"]>;
  NonEmptyString: ResolverTypeWrapper<Scalars["NonEmptyString"]["output"]>;
  NonNegativeFloat: ResolverTypeWrapper<Scalars["NonNegativeFloat"]["output"]>;
  NonNegativeInt: ResolverTypeWrapper<Scalars["NonNegativeInt"]["output"]>;
  NonPositiveFloat: ResolverTypeWrapper<Scalars["NonPositiveFloat"]["output"]>;
  NonPositiveInt: ResolverTypeWrapper<Scalars["NonPositiveInt"]["output"]>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]["output"]>;
  PaymentAmountDetails: PaymentAmountDetails;
  PaymentBillTo: PaymentBillTo;
  PaymentCard: PaymentCard;
  PaymentCardInformation: PaymentCardInformation;
  PaymentErrorInformation: ResolverTypeWrapper<PaymentErrorInformation>;
  PaymentOrderInformation: PaymentOrderInformation;
  PaymentRequest: PaymentRequest;
  PaymentResponse: ResolverTypeWrapper<PaymentResponse>;
  PaymentResponseAmountDetails: ResolverTypeWrapper<PaymentResponseAmountDetails>;
  PaymentResponseOrderInformation: ResolverTypeWrapper<PaymentResponseOrderInformation>;
  PaymentState: PaymentState;
  PersonalUser: ResolverTypeWrapper<PersonalUser>;
  PersonalUserAccount: ResolverTypeWrapper<PersonalUserAccount>;
  PersonalUserAccountProfile: ResolverTypeWrapper<PersonalUserAccountProfile>;
  PersonalUserAccountProfileBilling: ResolverTypeWrapper<PersonalUserAccountProfileBilling>;
  PersonalUserAccountProfileBillingUpdateInput: PersonalUserAccountProfileBillingUpdateInput;
  PersonalUserAccountProfileLocation: ResolverTypeWrapper<PersonalUserAccountProfileLocation>;
  PersonalUserAccountProfileLocationUpdateInput: PersonalUserAccountProfileLocationUpdateInput;
  PersonalUserAccountProfileUpdateInput: PersonalUserAccountProfileUpdateInput;
  PersonalUserAccountUpdateInput: PersonalUserAccountUpdateInput;
  PersonalUserUpdateInput: PersonalUserUpdateInput;
  PhoneNumber: ResolverTypeWrapper<Scalars["PhoneNumber"]["output"]>;
  Port: ResolverTypeWrapper<Scalars["Port"]["output"]>;
  PositiveFloat: ResolverTypeWrapper<Scalars["PositiveFloat"]["output"]>;
  PositiveInt: ResolverTypeWrapper<Scalars["PositiveInt"]["output"]>;
  PostalCode: ResolverTypeWrapper<Scalars["PostalCode"]["output"]>;
  Query: ResolverTypeWrapper<{}>;
  RGB: ResolverTypeWrapper<Scalars["RGB"]["output"]>;
  RGBA: ResolverTypeWrapper<Scalars["RGBA"]["output"]>;
  RefundOrderInformation: RefundOrderInformation;
  RefundRequest: RefundRequest;
  RefundResponse: ResolverTypeWrapper<RefundResponse>;
  ReservationRequest: ResolverTypeWrapper<ReservationRequest>;
  ReservationRequestMutationResult: ResolverTypeWrapper<ReservationRequestMutationResult>;
  ReservationRequestState: ReservationRequestState;
  RoutingNumber: ResolverTypeWrapper<Scalars["RoutingNumber"]["output"]>;
  SESSN: ResolverTypeWrapper<Scalars["SESSN"]["output"]>;
  SafeInt: ResolverTypeWrapper<Scalars["SafeInt"]["output"]>;
  SemVer: ResolverTypeWrapper<Scalars["SemVer"]["output"]>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Time: ResolverTypeWrapper<Scalars["Time"]["output"]>;
  TimeZone: ResolverTypeWrapper<Scalars["TimeZone"]["output"]>;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]["output"]>;
  URL: ResolverTypeWrapper<Scalars["URL"]["output"]>;
  USCurrency: ResolverTypeWrapper<Scalars["USCurrency"]["output"]>;
  UUID: ResolverTypeWrapper<Scalars["UUID"]["output"]>;
  UnsignedFloat: ResolverTypeWrapper<Scalars["UnsignedFloat"]["output"]>;
  UnsignedInt: ResolverTypeWrapper<Scalars["UnsignedInt"]["output"]>;
  User: ResolverTypeWrapper<User>;
  UtcOffset: ResolverTypeWrapper<Scalars["UtcOffset"]["output"]>;
  Void: ResolverTypeWrapper<Scalars["Void"]["output"]>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountNumber: Scalars["AccountNumber"]["output"];
  BigInt: Scalars["BigInt"]["output"];
  BlobAuthHeader: BlobAuthHeader;
  BlobIndexTag: BlobIndexTag;
  BlobMetadataField: BlobMetadataField;
  Boolean: Scalars["Boolean"]["output"];
  Byte: Scalars["Byte"]["output"];
  CancelReservationInput: CancelReservationInput;
  CloseReservationInput: CloseReservationInput;
  Conversation: Conversation;
  CountryCode: Scalars["CountryCode"]["output"];
  CountryName: Scalars["CountryName"]["output"];
  Cuid: Scalars["Cuid"]["output"];
  Currency: Scalars["Currency"]["output"];
  DID: Scalars["DID"]["output"];
  Date: Scalars["Date"]["output"];
  DateTime: Scalars["DateTime"]["output"];
  DateTimeISO: Scalars["DateTimeISO"]["output"];
  DeweyDecimal: Scalars["DeweyDecimal"]["output"];
  Duration: Scalars["Duration"]["output"];
  EmailAddress: Scalars["EmailAddress"]["output"];
  Float: Scalars["Float"]["output"];
  GUID: Scalars["GUID"]["output"];
  GeoJSON: Scalars["GeoJSON"]["output"];
  HSL: Scalars["HSL"]["output"];
  HSLA: Scalars["HSLA"]["output"];
  HexColorCode: Scalars["HexColorCode"]["output"];
  Hexadecimal: Scalars["Hexadecimal"]["output"];
  IBAN: Scalars["IBAN"]["output"];
  IP: Scalars["IP"]["output"];
  IPCPatent: Scalars["IPCPatent"]["output"];
  IPv4: Scalars["IPv4"]["output"];
  IPv6: Scalars["IPv6"]["output"];
  ISBN: Scalars["ISBN"]["output"];
  ISO8601Duration: Scalars["ISO8601Duration"]["output"];
  Int: Scalars["Int"]["output"];
  ItemListing: ItemListing;
  JSON: Scalars["JSON"]["output"];
  JSONObject: Scalars["JSONObject"]["output"];
  JWT: Scalars["JWT"]["output"];
  LCCSubclass: Scalars["LCCSubclass"]["output"];
  Latitude: Scalars["Latitude"]["output"];
  Listing: Listing;
  LocalDate: Scalars["LocalDate"]["output"];
  LocalDateTime: Scalars["LocalDateTime"]["output"];
  LocalEndTime: Scalars["LocalEndTime"]["output"];
  LocalTime: Scalars["LocalTime"]["output"];
  Locale: Scalars["Locale"]["output"];
  Long: Scalars["Long"]["output"];
  Longitude: Scalars["Longitude"]["output"];
  MAC: Scalars["MAC"]["output"];
  MongoBase: ResolversInterfaceTypes<ResolversParentTypes>["MongoBase"];
  MongoSubdocument: ResolversInterfaceTypes<ResolversParentTypes>["MongoSubdocument"];
  Mutation: {};
  MutationResult: ResolversInterfaceTypes<ResolversParentTypes>["MutationResult"];
  MutationStatus: MutationStatus;
  NegativeFloat: Scalars["NegativeFloat"]["output"];
  NegativeInt: Scalars["NegativeInt"]["output"];
  NonEmptyString: Scalars["NonEmptyString"]["output"];
  NonNegativeFloat: Scalars["NonNegativeFloat"]["output"];
  NonNegativeInt: Scalars["NonNegativeInt"]["output"];
  NonPositiveFloat: Scalars["NonPositiveFloat"]["output"];
  NonPositiveInt: Scalars["NonPositiveInt"]["output"];
  ObjectID: Scalars["ObjectID"]["output"];
  PaymentAmountDetails: PaymentAmountDetails;
  PaymentBillTo: PaymentBillTo;
  PaymentCard: PaymentCard;
  PaymentCardInformation: PaymentCardInformation;
  PaymentErrorInformation: PaymentErrorInformation;
  PaymentOrderInformation: PaymentOrderInformation;
  PaymentRequest: PaymentRequest;
  PaymentResponse: PaymentResponse;
  PaymentResponseAmountDetails: PaymentResponseAmountDetails;
  PaymentResponseOrderInformation: PaymentResponseOrderInformation;
  PersonalUser: PersonalUser;
  PersonalUserAccount: PersonalUserAccount;
  PersonalUserAccountProfile: PersonalUserAccountProfile;
  PersonalUserAccountProfileBilling: PersonalUserAccountProfileBilling;
  PersonalUserAccountProfileBillingUpdateInput: PersonalUserAccountProfileBillingUpdateInput;
  PersonalUserAccountProfileLocation: PersonalUserAccountProfileLocation;
  PersonalUserAccountProfileLocationUpdateInput: PersonalUserAccountProfileLocationUpdateInput;
  PersonalUserAccountProfileUpdateInput: PersonalUserAccountProfileUpdateInput;
  PersonalUserAccountUpdateInput: PersonalUserAccountUpdateInput;
  PersonalUserUpdateInput: PersonalUserUpdateInput;
  PhoneNumber: Scalars["PhoneNumber"]["output"];
  Port: Scalars["Port"]["output"];
  PositiveFloat: Scalars["PositiveFloat"]["output"];
  PositiveInt: Scalars["PositiveInt"]["output"];
  PostalCode: Scalars["PostalCode"]["output"];
  Query: {};
  RGB: Scalars["RGB"]["output"];
  RGBA: Scalars["RGBA"]["output"];
  RefundOrderInformation: RefundOrderInformation;
  RefundRequest: RefundRequest;
  RefundResponse: RefundResponse;
  ReservationRequest: ReservationRequest;
  ReservationRequestMutationResult: ReservationRequestMutationResult;
  RoutingNumber: Scalars["RoutingNumber"]["output"];
  SESSN: Scalars["SESSN"]["output"];
  SafeInt: Scalars["SafeInt"]["output"];
  SemVer: Scalars["SemVer"]["output"];
  String: Scalars["String"]["output"];
  Time: Scalars["Time"]["output"];
  TimeZone: Scalars["TimeZone"]["output"];
  Timestamp: Scalars["Timestamp"]["output"];
  URL: Scalars["URL"]["output"];
  USCurrency: Scalars["USCurrency"]["output"];
  UUID: Scalars["UUID"]["output"];
  UnsignedFloat: Scalars["UnsignedFloat"]["output"];
  UnsignedInt: Scalars["UnsignedInt"]["output"];
  User: User;
  UtcOffset: Scalars["UtcOffset"]["output"];
  Void: Scalars["Void"]["output"];
}>;

export type CacheControl22DirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars["Boolean"]["input"]>;
  maxAge?: Maybe<Scalars["Int"]["input"]>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControl22DirectiveResolver<Result, Parent, ContextType = GraphContext, Args = CacheControl22DirectiveArgs> = DirectiveResolverFn<
  Result,
  Parent,
  ContextType,
  Args
>;

export interface AccountNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["AccountNumber"], any> {
  name: "AccountNumber";
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export type BlobAuthHeaderResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["BlobAuthHeader"] = ResolversParentTypes["BlobAuthHeader"],
> = ResolversObject<{
  authHeader?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  blobName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  blobPath?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  indexTags?: Resolver<Maybe<Array<Maybe<ResolversTypes["BlobIndexTag"]>>>, ParentType, ContextType>;
  metadataFields?: Resolver<Maybe<Array<Maybe<ResolversTypes["BlobMetadataField"]>>>, ParentType, ContextType>;
  requestDate?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlobIndexTagResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["BlobIndexTag"] = ResolversParentTypes["BlobIndexTag"],
> = ResolversObject<{
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlobMetadataFieldResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["BlobMetadataField"] = ResolversParentTypes["BlobMetadataField"],
> = ResolversObject<{
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ByteScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Byte"], any> {
  name: "Byte";
}

export type ConversationResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["Conversation"] = ResolversParentTypes["Conversation"],
> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  listing?: Resolver<Maybe<ResolversTypes["Listing"]>, ParentType, ContextType>;
  reserver?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  sharer?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  twilioConversationId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface CountryCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["CountryCode"], any> {
  name: "CountryCode";
}

export interface CountryNameScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["CountryName"], any> {
  name: "CountryName";
}

export interface CuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Cuid"], any> {
  name: "Cuid";
}

export interface CurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Currency"], any> {
  name: "Currency";
}

export interface DidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["DID"], any> {
  name: "DID";
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export interface DateTimeIsoScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["DateTimeISO"], any> {
  name: "DateTimeISO";
}

export interface DeweyDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["DeweyDecimal"], any> {
  name: "DeweyDecimal";
}

export interface DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Duration"], any> {
  name: "Duration";
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["EmailAddress"], any> {
  name: "EmailAddress";
}

export interface GuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["GUID"], any> {
  name: "GUID";
}

export interface GeoJsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["GeoJSON"], any> {
  name: "GeoJSON";
}

export interface HslScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["HSL"], any> {
  name: "HSL";
}

export interface HslaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["HSLA"], any> {
  name: "HSLA";
}

export interface HexColorCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["HexColorCode"], any> {
  name: "HexColorCode";
}

export interface HexadecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Hexadecimal"], any> {
  name: "Hexadecimal";
}

export interface IbanScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["IBAN"], any> {
  name: "IBAN";
}

export interface IpScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["IP"], any> {
  name: "IP";
}

export interface IpcPatentScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["IPCPatent"], any> {
  name: "IPCPatent";
}

export interface IPv4ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["IPv4"], any> {
  name: "IPv4";
}

export interface IPv6ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["IPv6"], any> {
  name: "IPv6";
}

export interface IsbnScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["ISBN"], any> {
  name: "ISBN";
}

export interface Iso8601DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["ISO8601Duration"], any> {
  name: "ISO8601Duration";
}

export type ItemListingResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ItemListing"] = ResolversParentTypes["ItemListing"],
> = ResolversObject<{
  category?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<ResolversTypes["String"]>>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  reports?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  sharer?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  sharingHistory?: Resolver<Maybe<Array<ResolversTypes["String"]>>, ParentType, ContextType>;
  sharingPeriodEnd?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  sharingPeriodStart?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["ItemListingState"]>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["JSONObject"], any> {
  name: "JSONObject";
}

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["JWT"], any> {
  name: "JWT";
}

export interface LccSubclassScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["LCCSubclass"], any> {
  name: "LCCSubclass";
}

export interface LatitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Latitude"], any> {
  name: "Latitude";
}

export type ListingResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["Listing"] = ResolversParentTypes["Listing"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface LocalDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["LocalDate"], any> {
  name: "LocalDate";
}

export interface LocalDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["LocalDateTime"], any> {
  name: "LocalDateTime";
}

export interface LocalEndTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["LocalEndTime"], any> {
  name: "LocalEndTime";
}

export interface LocalTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["LocalTime"], any> {
  name: "LocalTime";
}

export interface LocaleScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Locale"], any> {
  name: "Locale";
}

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Long"], any> {
  name: "Long";
}

export interface LongitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Longitude"], any> {
  name: "Longitude";
}

export interface MacScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["MAC"], any> {
  name: "MAC";
}

export type MongoBaseResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["MongoBase"] = ResolversParentTypes["MongoBase"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<"Conversation" | "ItemListing" | "PersonalUser", ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
}>;

export type MongoSubdocumentResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["MongoSubdocument"] = ResolversParentTypes["MongoSubdocument"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  cancelReservation?: Resolver<ResolversTypes["ReservationRequest"], ParentType, ContextType, RequireFields<MutationCancelReservationArgs, "input">>;
  closeReservation?: Resolver<ResolversTypes["ReservationRequest"], ParentType, ContextType, RequireFields<MutationCloseReservationArgs, "input">>;
  personalUserUpdate?: Resolver<ResolversTypes["PersonalUser"], ParentType, ContextType, RequireFields<MutationPersonalUserUpdateArgs, "input">>;
  processPayment?: Resolver<ResolversTypes["PaymentResponse"], ParentType, ContextType, RequireFields<MutationProcessPaymentArgs, "request">>;
  refundPayment?: Resolver<ResolversTypes["RefundResponse"], ParentType, ContextType, RequireFields<MutationRefundPaymentArgs, "request">>;
}>;

export type MutationResultResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["MutationResult"] = ResolversParentTypes["MutationResult"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<"ReservationRequestMutationResult", ParentType, ContextType>;
  status?: Resolver<ResolversTypes["MutationStatus"], ParentType, ContextType>;
}>;

export type MutationStatusResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["MutationStatus"] = ResolversParentTypes["MutationStatus"],
> = ResolversObject<{
  errorMessage?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface NegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["NegativeFloat"], any> {
  name: "NegativeFloat";
}

export interface NegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["NegativeInt"], any> {
  name: "NegativeInt";
}

export interface NonEmptyStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["NonEmptyString"], any> {
  name: "NonEmptyString";
}

export interface NonNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["NonNegativeFloat"], any> {
  name: "NonNegativeFloat";
}

export interface NonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["NonNegativeInt"], any> {
  name: "NonNegativeInt";
}

export interface NonPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["NonPositiveFloat"], any> {
  name: "NonPositiveFloat";
}

export interface NonPositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["NonPositiveInt"], any> {
  name: "NonPositiveInt";
}

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export type PaymentErrorInformationResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PaymentErrorInformation"] = ResolversParentTypes["PaymentErrorInformation"],
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentResponseResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PaymentResponse"] = ResolversParentTypes["PaymentResponse"],
> = ResolversObject<{
  errorInformation?: Resolver<Maybe<ResolversTypes["PaymentErrorInformation"]>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  orderInformation?: Resolver<Maybe<ResolversTypes["PaymentResponseOrderInformation"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentResponseAmountDetailsResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PaymentResponseAmountDetails"] = ResolversParentTypes["PaymentResponseAmountDetails"],
> = ResolversObject<{
  currency?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  totalAmount?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentResponseOrderInformationResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PaymentResponseOrderInformation"] = ResolversParentTypes["PaymentResponseOrderInformation"],
> = ResolversObject<{
  amountDetails?: Resolver<Maybe<ResolversTypes["PaymentResponseAmountDetails"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUser"] = ResolversParentTypes["PersonalUser"],
> = ResolversObject<{
  account?: Resolver<Maybe<ResolversTypes["PersonalUserAccount"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  isBlocked?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  userType?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserAccountResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUserAccount"] = ResolversParentTypes["PersonalUserAccount"],
> = ResolversObject<{
  accountType?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes["PersonalUserAccountProfile"]>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserAccountProfileResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUserAccountProfile"] = ResolversParentTypes["PersonalUserAccountProfile"],
> = ResolversObject<{
  billing?: Resolver<Maybe<ResolversTypes["PersonalUserAccountProfileBilling"]>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes["PersonalUserAccountProfileLocation"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserAccountProfileBillingResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUserAccountProfileBilling"] = ResolversParentTypes["PersonalUserAccountProfileBilling"],
> = ResolversObject<{
  cybersourceCustomerId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  lastPaymentAmount?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  lastTransactionId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  paymentState?: Resolver<Maybe<ResolversTypes["PaymentState"]>, ParentType, ContextType>;
  subscriptionId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserAccountProfileLocationResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUserAccountProfileLocation"] = ResolversParentTypes["PersonalUserAccountProfileLocation"],
> = ResolversObject<{
  address1?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  zipCode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PhoneNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["PhoneNumber"], any> {
  name: "PhoneNumber";
}

export interface PortScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Port"], any> {
  name: "Port";
}

export interface PositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["PositiveFloat"], any> {
  name: "PositiveFloat";
}

export interface PositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["PositiveInt"], any> {
  name: "PositiveInt";
}

export interface PostalCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["PostalCode"], any> {
  name: "PostalCode";
}

export type QueryResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  conversation?: Resolver<Maybe<ResolversTypes["Conversation"]>, ParentType, ContextType, RequireFields<QueryConversationArgs, "id">>;
  conversations?: Resolver<Array<ResolversTypes["Conversation"]>, ParentType, ContextType>;
  currentPersonalUserAndCreateIfNotExists?: Resolver<ResolversTypes["PersonalUser"], ParentType, ContextType>;
  itemListing?: Resolver<Maybe<ResolversTypes["ItemListing"]>, ParentType, ContextType, RequireFields<QueryItemListingArgs, "id">>;
  itemListings?: Resolver<Array<ResolversTypes["ItemListing"]>, ParentType, ContextType>;
  myActiveReservations?: Resolver<
    Array<ResolversTypes["ReservationRequest"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMyActiveReservationsArgs, "userId">
  >;
  myPastReservations?: Resolver<
    Array<ResolversTypes["ReservationRequest"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMyPastReservationsArgs, "userId">
  >;
  personalUserById?: Resolver<Maybe<ResolversTypes["PersonalUser"]>, ParentType, ContextType, RequireFields<QueryPersonalUserByIdArgs, "id">>;
}>;

export interface RgbScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["RGB"], any> {
  name: "RGB";
}

export interface RgbaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["RGBA"], any> {
  name: "RGBA";
}

export type RefundResponseResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["RefundResponse"] = ResolversParentTypes["RefundResponse"],
> = ResolversObject<{
  errorInformation?: Resolver<Maybe<ResolversTypes["PaymentErrorInformation"]>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  orderInformation?: Resolver<Maybe<ResolversTypes["PaymentResponseOrderInformation"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReservationRequestResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ReservationRequest"] = ResolversParentTypes["ReservationRequest"],
> = ResolversObject<{
  closeRequestedByReserver?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  closeRequestedBySharer?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  listing?: Resolver<ResolversTypes["ItemListing"], ParentType, ContextType>;
  reservationPeriodEnd?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  reservationPeriodStart?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  reserver?: Resolver<ResolversTypes["PersonalUser"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["ReservationRequestState"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReservationRequestMutationResultResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ReservationRequestMutationResult"] = ResolversParentTypes["ReservationRequestMutationResult"],
> = ResolversObject<{
  reservationRequest?: Resolver<Maybe<ResolversTypes["ReservationRequest"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["MutationStatus"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface RoutingNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["RoutingNumber"], any> {
  name: "RoutingNumber";
}

export interface SessnScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["SESSN"], any> {
  name: "SESSN";
}

export interface SafeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["SafeInt"], any> {
  name: "SafeInt";
}

export interface SemVerScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["SemVer"], any> {
  name: "SemVer";
}

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Time"], any> {
  name: "Time";
}

export interface TimeZoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["TimeZone"], any> {
  name: "TimeZone";
}

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Timestamp"], any> {
  name: "Timestamp";
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["URL"], any> {
  name: "URL";
}

export interface UsCurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["USCurrency"], any> {
  name: "USCurrency";
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["UUID"], any> {
  name: "UUID";
}

export interface UnsignedFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["UnsignedFloat"], any> {
  name: "UnsignedFloat";
}

export interface UnsignedIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["UnsignedInt"], any> {
  name: "UnsignedInt";
}

export type UserResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UtcOffsetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["UtcOffset"], any> {
  name: "UtcOffset";
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Void"], any> {
  name: "Void";
}

export type Resolvers<ContextType = GraphContext> = ResolversObject<{
  AccountNumber?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  BlobAuthHeader?: BlobAuthHeaderResolvers<ContextType>;
  BlobIndexTag?: BlobIndexTagResolvers<ContextType>;
  BlobMetadataField?: BlobMetadataFieldResolvers<ContextType>;
  Byte?: GraphQLScalarType;
  Conversation?: ConversationResolvers<ContextType>;
  CountryCode?: GraphQLScalarType;
  CountryName?: GraphQLScalarType;
  Cuid?: GraphQLScalarType;
  Currency?: GraphQLScalarType;
  DID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DateTimeISO?: GraphQLScalarType;
  DeweyDecimal?: GraphQLScalarType;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  GUID?: GraphQLScalarType;
  GeoJSON?: GraphQLScalarType;
  HSL?: GraphQLScalarType;
  HSLA?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Hexadecimal?: GraphQLScalarType;
  IBAN?: GraphQLScalarType;
  IP?: GraphQLScalarType;
  IPCPatent?: GraphQLScalarType;
  IPv4?: GraphQLScalarType;
  IPv6?: GraphQLScalarType;
  ISBN?: GraphQLScalarType;
  ISO8601Duration?: GraphQLScalarType;
  ItemListing?: ItemListingResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  JWT?: GraphQLScalarType;
  LCCSubclass?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  Listing?: ListingResolvers<ContextType>;
  LocalDate?: GraphQLScalarType;
  LocalDateTime?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Locale?: GraphQLScalarType;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  MongoBase?: MongoBaseResolvers<ContextType>;
  MongoSubdocument?: MongoSubdocumentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationResult?: MutationResultResolvers<ContextType>;
  MutationStatus?: MutationStatusResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  PaymentErrorInformation?: PaymentErrorInformationResolvers<ContextType>;
  PaymentResponse?: PaymentResponseResolvers<ContextType>;
  PaymentResponseAmountDetails?: PaymentResponseAmountDetailsResolvers<ContextType>;
  PaymentResponseOrderInformation?: PaymentResponseOrderInformationResolvers<ContextType>;
  PersonalUser?: PersonalUserResolvers<ContextType>;
  PersonalUserAccount?: PersonalUserAccountResolvers<ContextType>;
  PersonalUserAccountProfile?: PersonalUserAccountProfileResolvers<ContextType>;
  PersonalUserAccountProfileBilling?: PersonalUserAccountProfileBillingResolvers<ContextType>;
  PersonalUserAccountProfileLocation?: PersonalUserAccountProfileLocationResolvers<ContextType>;
  PhoneNumber?: GraphQLScalarType;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  RefundResponse?: RefundResponseResolvers<ContextType>;
  ReservationRequest?: ReservationRequestResolvers<ContextType>;
  ReservationRequestMutationResult?: ReservationRequestMutationResultResolvers<ContextType>;
  RoutingNumber?: GraphQLScalarType;
  SESSN?: GraphQLScalarType;
  SafeInt?: GraphQLScalarType;
  SemVer?: GraphQLScalarType;
  Time?: GraphQLScalarType;
  TimeZone?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  USCurrency?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  UnsignedFloat?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UtcOffset?: GraphQLScalarType;
  Void?: GraphQLScalarType;
}>;

export type DirectiveResolvers<ContextType = GraphContext> = ResolversObject<{
  cacheControl22?: CacheControl22DirectiveResolver<any, any, ContextType>;
}>;
