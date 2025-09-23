import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
import type { GraphContext } from "../../init/context.ts";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  readonly __typename?: "BlobAuthHeader";
  readonly authHeader?: Maybe<Scalars["String"]["output"]>;
  readonly blobName?: Maybe<Scalars["String"]["output"]>;
  readonly blobPath?: Maybe<Scalars["String"]["output"]>;
  readonly indexTags?: Maybe<ReadonlyArray<Maybe<BlobIndexTag>>>;
  readonly metadataFields?: Maybe<ReadonlyArray<Maybe<BlobMetadataField>>>;
  readonly requestDate?: Maybe<Scalars["String"]["output"]>;
};

export type BlobIndexTag = {
  readonly __typename?: "BlobIndexTag";
  readonly name: Scalars["String"]["output"];
  readonly value: Scalars["String"]["output"];
};

export type BlobMetadataField = {
  readonly __typename?: "BlobMetadataField";
  readonly name: Scalars["String"]["output"];
  readonly value: Scalars["String"]["output"];
};

/**  Required to enable Apollo Cache Control  */
export type CacheControlScope = "PRIVATE" | "PUBLIC";

export type CancelReservationInput = {
  readonly id: Scalars["ObjectID"]["input"];
};

export type CloseReservationInput = {
  readonly id: Scalars["ObjectID"]["input"];
};

export type Conversation = MongoBase & {
  readonly __typename?: "Conversation";
  readonly createdAt: Scalars["DateTime"]["output"];
  readonly id: Scalars["ObjectID"]["output"];
  readonly listing: Listing;
  readonly reserver: User;
  readonly schemaVersion: Scalars["String"]["output"];
  readonly sharer: User;
  readonly twilioConversationId: Scalars["String"]["output"];
  readonly updatedAt: Scalars["DateTime"]["output"];
};

export type ConversationCreateInput = {
  readonly listingId: Scalars["ObjectID"]["input"];
  readonly reserverId: Scalars["ObjectID"]["input"];
  readonly sharerId: Scalars["ObjectID"]["input"];
};

export type ConversationMutationResult = MutationResult & {
  readonly __typename?: "ConversationMutationResult";
  readonly conversation?: Maybe<Conversation>;
  readonly status: MutationStatus;
};

export type CreateItemListingInput = {
  readonly category: Scalars["String"]["input"];
  readonly description: Scalars["String"]["input"];
  readonly images?: InputMaybe<ReadonlyArray<Scalars["String"]["input"]>>;
  readonly isDraft?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly location: Scalars["String"]["input"];
  readonly sharingPeriodEnd: Scalars["DateTime"]["input"];
  readonly sharingPeriodStart: Scalars["DateTime"]["input"];
  readonly title: Scalars["String"]["input"];
};

export type CreateReservationRequestInput = {
  readonly listingId: Scalars["ObjectID"]["input"];
  readonly reservationPeriodEnd: Scalars["DateTime"]["input"];
  readonly reservationPeriodStart: Scalars["DateTime"]["input"];
};

export type ItemListing = MongoBase & {
  readonly __typename?: "ItemListing";
  readonly category: Scalars["String"]["output"];
  readonly createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  readonly description: Scalars["String"]["output"];
  readonly id: Scalars["ObjectID"]["output"];
  readonly images?: Maybe<ReadonlyArray<Scalars["String"]["output"]>>;
  readonly location: Scalars["String"]["output"];
  readonly reports?: Maybe<Scalars["Int"]["output"]>;
  readonly schemaVersion?: Maybe<Scalars["String"]["output"]>;
  readonly sharer: User;
  readonly sharingHistory?: Maybe<ReadonlyArray<Scalars["String"]["output"]>>;
  readonly sharingPeriodEnd: Scalars["DateTime"]["output"];
  readonly sharingPeriodStart: Scalars["DateTime"]["output"];
  readonly state?: Maybe<Scalars["String"]["output"]>;
  readonly title: Scalars["String"]["output"];
  readonly updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  readonly version?: Maybe<Scalars["Int"]["output"]>;
};

export type Listing = ItemListing;

export type ListingAll = {
  readonly __typename?: "ListingAll";
  readonly id: Scalars["ID"]["output"];
  readonly image?: Maybe<Scalars["String"]["output"]>;
  readonly pendingRequestsCount: Scalars["Int"]["output"];
  readonly publishedAt?: Maybe<Scalars["String"]["output"]>;
  readonly reservationPeriod?: Maybe<Scalars["String"]["output"]>;
  readonly status: Scalars["String"]["output"];
  readonly title: Scalars["String"]["output"];
};

export type ListingAllPage = {
  readonly __typename?: "ListingAllPage";
  readonly items: ReadonlyArray<ListingAll>;
  readonly page: Scalars["Int"]["output"];
  readonly pageSize: Scalars["Int"]["output"];
  readonly total: Scalars["Int"]["output"];
};

export type ListingRequest = {
  readonly __typename?: "ListingRequest";
  readonly id: Scalars["ID"]["output"];
  readonly image?: Maybe<Scalars["String"]["output"]>;
  readonly requestedBy: Scalars["String"]["output"];
  readonly requestedOn: Scalars["String"]["output"];
  readonly reservationPeriod: Scalars["String"]["output"];
  readonly status: Scalars["String"]["output"];
  readonly title: Scalars["String"]["output"];
};

export type ListingRequestPage = {
  readonly __typename?: "ListingRequestPage";
  readonly items: ReadonlyArray<ListingRequest>;
  readonly page: Scalars["Int"]["output"];
  readonly pageSize: Scalars["Int"]["output"];
  readonly total: Scalars["Int"]["output"];
};

/** Base type for all models in mongo. */
export type MongoBase = {
  readonly createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** The ID of the object. */
  readonly id: Scalars["ObjectID"]["output"];
  readonly schemaVersion?: Maybe<Scalars["String"]["output"]>;
  /** Automatically generated timestamp, updated on every save. */
  readonly updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

/** Base type for all models in mongo. */
export type MongoSubdocument = {
  readonly createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** The ID of the object. */
  readonly id: Scalars["ObjectID"]["output"];
  /** Automatically generated timestamp, updated on every save. */
  readonly updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

/**  Base Mutation Type definition - all mutations will be defined in separate files extending this type  */
export type Mutation = {
  readonly __typename?: "Mutation";
  /** IGNORE: Dummy field necessary for the Mutation type to be valid */
  readonly _empty?: Maybe<Scalars["String"]["output"]>;
  readonly cancelReservation: ReservationRequest;
  readonly closeReservation: ReservationRequest;
  readonly createConversation: ConversationMutationResult;
  readonly createItemListing: ItemListing;
  readonly createReservationRequest: ReservationRequest;
  readonly personalUserUpdate: PersonalUser;
  readonly processPayment: PaymentResponse;
  readonly refundPayment: RefundResponse;
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
  readonly status: MutationStatus;
};

export type MutationStatus = {
  readonly __typename?: "MutationStatus";
  readonly errorMessage?: Maybe<Scalars["String"]["output"]>;
  readonly success: Scalars["Boolean"]["output"];
};

export type PaymentAmountDetails = {
  readonly currency: Scalars["String"]["input"];
  readonly totalAmount: Scalars["Float"]["input"];
};

export type PaymentBillTo = {
  readonly address1: Scalars["String"]["input"];
  readonly address2?: InputMaybe<Scalars["String"]["input"]>;
  readonly city: Scalars["String"]["input"];
  readonly country: Scalars["String"]["input"];
  readonly email?: InputMaybe<Scalars["String"]["input"]>;
  readonly firstName: Scalars["String"]["input"];
  readonly lastName: Scalars["String"]["input"];
  readonly phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  readonly postalCode: Scalars["String"]["input"];
  readonly state: Scalars["String"]["input"];
};

export type PaymentCard = {
  readonly expirationMonth: Scalars["String"]["input"];
  readonly expirationYear: Scalars["String"]["input"];
  readonly number: Scalars["String"]["input"];
  readonly securityCode: Scalars["String"]["input"];
};

export type PaymentCardInformation = {
  readonly card: PaymentCard;
};

export type PaymentErrorInformation = {
  readonly __typename?: "PaymentErrorInformation";
  readonly message?: Maybe<Scalars["String"]["output"]>;
  readonly reason?: Maybe<Scalars["String"]["output"]>;
};

export type PaymentOrderInformation = {
  readonly amountDetails: PaymentAmountDetails;
  readonly billTo: PaymentBillTo;
};

export type PaymentRequest = {
  readonly orderInformation: PaymentOrderInformation;
  readonly paymentInformation: PaymentCardInformation;
  readonly userId: Scalars["ObjectID"]["input"];
};

export type PaymentResponse = {
  readonly __typename?: "PaymentResponse";
  readonly errorInformation?: Maybe<PaymentErrorInformation>;
  readonly id?: Maybe<Scalars["String"]["output"]>;
  readonly message?: Maybe<Scalars["String"]["output"]>;
  readonly orderInformation?: Maybe<PaymentResponseOrderInformation>;
  readonly status: Scalars["String"]["output"];
  readonly success?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PaymentResponseAmountDetails = {
  readonly __typename?: "PaymentResponseAmountDetails";
  readonly currency?: Maybe<Scalars["String"]["output"]>;
  readonly totalAmount?: Maybe<Scalars["String"]["output"]>;
};

export type PaymentResponseOrderInformation = {
  readonly __typename?: "PaymentResponseOrderInformation";
  readonly amountDetails?: Maybe<PaymentResponseAmountDetails>;
};

export type PersonalUser = MongoBase & {
  readonly __typename?: "PersonalUser";
  readonly account?: Maybe<PersonalUserAccount>;
  readonly createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  readonly hasCompletedOnboarding?: Maybe<Scalars["Boolean"]["output"]>;
  readonly id: Scalars["ObjectID"]["output"];
  readonly isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
  readonly role?: Maybe<PersonalUserRole>;
  readonly schemaVersion?: Maybe<Scalars["String"]["output"]>;
  readonly updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  readonly userType?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccount = {
  readonly __typename?: "PersonalUserAccount";
  readonly accountType?: Maybe<Scalars["String"]["output"]>;
  readonly email?: Maybe<Scalars["String"]["output"]>;
  readonly profile?: Maybe<PersonalUserAccountProfile>;
  readonly username?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountProfile = {
  readonly __typename?: "PersonalUserAccountProfile";
  readonly billing?: Maybe<PersonalUserAccountProfileBilling>;
  readonly firstName?: Maybe<Scalars["String"]["output"]>;
  readonly lastName?: Maybe<Scalars["String"]["output"]>;
  readonly location?: Maybe<PersonalUserAccountProfileLocation>;
};

export type PersonalUserAccountProfileBilling = {
  readonly __typename?: "PersonalUserAccountProfileBilling";
  readonly cybersourceCustomerId?: Maybe<Scalars["String"]["output"]>;
  readonly lastPaymentAmount?: Maybe<Scalars["Float"]["output"]>;
  readonly lastTransactionId?: Maybe<Scalars["String"]["output"]>;
  readonly paymentState?: Maybe<Scalars["String"]["output"]>;
  readonly subscriptionId?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountProfileBillingUpdateInput = {
  readonly cybersourceCustomerId?: InputMaybe<Scalars["String"]["input"]>;
  readonly lastPaymentAmount?: InputMaybe<Scalars["Float"]["input"]>;
  readonly lastTransactionId?: InputMaybe<Scalars["String"]["input"]>;
  readonly paymentState?: InputMaybe<Scalars["String"]["input"]>;
  readonly subscriptionId?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserAccountProfileLocation = {
  readonly __typename?: "PersonalUserAccountProfileLocation";
  readonly address1?: Maybe<Scalars["String"]["output"]>;
  readonly address2?: Maybe<Scalars["String"]["output"]>;
  readonly city?: Maybe<Scalars["String"]["output"]>;
  readonly country?: Maybe<Scalars["String"]["output"]>;
  readonly state?: Maybe<Scalars["String"]["output"]>;
  readonly zipCode?: Maybe<Scalars["String"]["output"]>;
};

export type PersonalUserAccountProfileLocationUpdateInput = {
  readonly address1?: InputMaybe<Scalars["String"]["input"]>;
  readonly address2?: InputMaybe<Scalars["String"]["input"]>;
  readonly city?: InputMaybe<Scalars["String"]["input"]>;
  readonly country?: InputMaybe<Scalars["String"]["input"]>;
  readonly state?: InputMaybe<Scalars["String"]["input"]>;
  readonly zipCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserAccountProfileUpdateInput = {
  readonly billing?: InputMaybe<PersonalUserAccountProfileBillingUpdateInput>;
  readonly firstName?: InputMaybe<Scalars["String"]["input"]>;
  readonly lastName?: InputMaybe<Scalars["String"]["input"]>;
  readonly location?: InputMaybe<PersonalUserAccountProfileLocationUpdateInput>;
};

export type PersonalUserAccountUpdateInput = {
  readonly accountType?: InputMaybe<Scalars["String"]["input"]>;
  readonly profile?: InputMaybe<PersonalUserAccountProfileUpdateInput>;
  readonly username?: InputMaybe<Scalars["String"]["input"]>;
};

export type PersonalUserRole = MongoBase & {
  readonly __typename?: "PersonalUserRole";
  readonly createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  readonly id: Scalars["ObjectID"]["output"];
  readonly isDefault?: Maybe<Scalars["Boolean"]["output"]>;
  readonly permissions?: Maybe<PersonalUserRolePermissions>;
  readonly roleName?: Maybe<Scalars["String"]["output"]>;
  readonly roleType?: Maybe<Scalars["String"]["output"]>;
  readonly schemaVersion?: Maybe<Scalars["String"]["output"]>;
  readonly updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type PersonalUserRoleConversationPermissions = {
  readonly __typename?: "PersonalUserRoleConversationPermissions";
  readonly canCreateConversation?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canManageConversation?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canViewConversation?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PersonalUserRoleListingPermissions = {
  readonly __typename?: "PersonalUserRoleListingPermissions";
  readonly canCreateItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canDeleteItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canPublishItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canUnpublishItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canUpdateItemListing?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canViewItemListing?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PersonalUserRolePermissions = {
  readonly __typename?: "PersonalUserRolePermissions";
  readonly conversationPermissions?: Maybe<PersonalUserRoleConversationPermissions>;
  readonly listingPermissions?: Maybe<PersonalUserRoleListingPermissions>;
  readonly reservationRequestPermissions?: Maybe<PersonalUserRoleReservationRequestPermissions>;
};

export type PersonalUserRoleReservationRequestPermissions = {
  readonly __typename?: "PersonalUserRoleReservationRequestPermissions";
  readonly canCreateReservationRequest?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canManageReservationRequest?: Maybe<Scalars["Boolean"]["output"]>;
  readonly canViewReservationRequest?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PersonalUserUpdateInput = {
  readonly account?: InputMaybe<PersonalUserAccountUpdateInput>;
  readonly id: Scalars["ObjectID"]["input"];
  readonly isBlocked?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type Query = {
  readonly __typename?: "Query";
  /** IGNORE: Dummy field necessary for the Query type to be valid */
  readonly _empty?: Maybe<Scalars["String"]["output"]>;
  readonly conversation?: Maybe<Conversation>;
  readonly conversationsByUser?: Maybe<ReadonlyArray<Maybe<Conversation>>>;
  readonly currentPersonalUserAndCreateIfNotExists: PersonalUser;
  readonly itemListing?: Maybe<ItemListing>;
  readonly itemListings: ReadonlyArray<ItemListing>;
  readonly myActiveReservationForListing?: Maybe<ReservationRequest>;
  readonly myActiveReservations: ReadonlyArray<ReservationRequest>;
  readonly myListingsAll: ListingAllPage;
  readonly myListingsRequests: ListingRequestPage;
  readonly myPastReservations: ReadonlyArray<ReservationRequest>;
  readonly overlapActiveReservationRequestsForListing: ReadonlyArray<ReservationRequest>;
  readonly personalUserById?: Maybe<PersonalUser>;
  readonly queryActiveByListingId: ReadonlyArray<Maybe<ReservationRequest>>;
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
  statusFilters?: InputMaybe<ReadonlyArray<Scalars["String"]["input"]>>;
};

/**  Base Query Type definition - , all mutations will be defined in separate files extending this type  */
export type QueryMyListingsRequestsArgs = {
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
  searchText: Scalars["String"]["input"];
  sharerId: Scalars["ObjectID"]["input"];
  sorter: SorterInput;
  statusFilters: ReadonlyArray<Scalars["String"]["input"]>;
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
  readonly amountDetails: PaymentAmountDetails;
};

export type RefundRequest = {
  readonly amount?: InputMaybe<Scalars["Float"]["input"]>;
  readonly orderInformation: RefundOrderInformation;
  readonly transactionId: Scalars["String"]["input"];
  readonly userId: Scalars["ObjectID"]["input"];
};

export type RefundResponse = {
  readonly __typename?: "RefundResponse";
  readonly errorInformation?: Maybe<PaymentErrorInformation>;
  readonly id?: Maybe<Scalars["String"]["output"]>;
  readonly message?: Maybe<Scalars["String"]["output"]>;
  readonly orderInformation?: Maybe<PaymentResponseOrderInformation>;
  readonly status: Scalars["String"]["output"];
  readonly success?: Maybe<Scalars["Boolean"]["output"]>;
};

export type ReservationRequest = {
  readonly __typename?: "ReservationRequest";
  readonly closeRequestedByReserver?: Maybe<Scalars["Boolean"]["output"]>;
  readonly closeRequestedBySharer?: Maybe<Scalars["Boolean"]["output"]>;
  readonly createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  readonly id: Scalars["ObjectID"]["output"];
  readonly listing?: Maybe<ItemListing>;
  readonly reservationPeriodEnd?: Maybe<Scalars["DateTime"]["output"]>;
  readonly reservationPeriodStart?: Maybe<Scalars["DateTime"]["output"]>;
  readonly reserver?: Maybe<PersonalUser>;
  readonly state?: Maybe<ReservationRequestState>;
  readonly updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ReservationRequestMutationResult = MutationResult & {
  readonly __typename?: "ReservationRequestMutationResult";
  readonly reservationRequest?: Maybe<ReservationRequest>;
  readonly status: MutationStatus;
};

export type ReservationRequestState = "Accepted" | "Cancelled" | "Closed" | "Rejected" | "Requested";

export type SorterInput = {
  readonly field: Scalars["String"]["input"];
  readonly order: Scalars["String"]["input"];
};

export type User = PersonalUser;

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

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Listing: import("@sthrift/domain").Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
  User: import("@sthrift/domain").Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  MongoBase:
    | import("@sthrift/domain").Domain.Contexts.Conversation.Conversation.ConversationEntityReference
    | import("@sthrift/domain").Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
    | import("@sthrift/domain").Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
    | PersonalUserRole;
  MongoSubdocument: never;
  MutationResult:
    | (Omit<ConversationMutationResult, "conversation"> & { conversation?: Maybe<_RefType["Conversation"]> })
    | (Omit<ReservationRequestMutationResult, "reservationRequest"> & { reservationRequest?: Maybe<_RefType["ReservationRequest"]> });
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
  Conversation: ResolverTypeWrapper<import("@sthrift/domain").Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
  ConversationCreateInput: ConversationCreateInput;
  ConversationMutationResult: ResolverTypeWrapper<
    Omit<ConversationMutationResult, "conversation"> & { conversation?: Maybe<ResolversTypes["Conversation"]> }
  >;
  CountryCode: ResolverTypeWrapper<Scalars["CountryCode"]["output"]>;
  CountryName: ResolverTypeWrapper<Scalars["CountryName"]["output"]>;
  CreateItemListingInput: CreateItemListingInput;
  CreateReservationRequestInput: CreateReservationRequestInput;
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
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  IP: ResolverTypeWrapper<Scalars["IP"]["output"]>;
  IPCPatent: ResolverTypeWrapper<Scalars["IPCPatent"]["output"]>;
  IPv4: ResolverTypeWrapper<Scalars["IPv4"]["output"]>;
  IPv6: ResolverTypeWrapper<Scalars["IPv6"]["output"]>;
  ISBN: ResolverTypeWrapper<Scalars["ISBN"]["output"]>;
  ISO8601Duration: ResolverTypeWrapper<Scalars["ISO8601Duration"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  ItemListing: ResolverTypeWrapper<import("@sthrift/domain").Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]["output"]>;
  JSONObject: ResolverTypeWrapper<Scalars["JSONObject"]["output"]>;
  JWT: ResolverTypeWrapper<Scalars["JWT"]["output"]>;
  LCCSubclass: ResolverTypeWrapper<Scalars["LCCSubclass"]["output"]>;
  Latitude: ResolverTypeWrapper<Scalars["Latitude"]["output"]>;
  Listing: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>["Listing"]>;
  ListingAll: ResolverTypeWrapper<ListingAll>;
  ListingAllPage: ResolverTypeWrapper<ListingAllPage>;
  ListingRequest: ResolverTypeWrapper<ListingRequest>;
  ListingRequestPage: ResolverTypeWrapper<ListingRequestPage>;
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
  PersonalUser: ResolverTypeWrapper<import("@sthrift/domain").Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
  PersonalUserAccount: ResolverTypeWrapper<PersonalUserAccount>;
  PersonalUserAccountProfile: ResolverTypeWrapper<PersonalUserAccountProfile>;
  PersonalUserAccountProfileBilling: ResolverTypeWrapper<PersonalUserAccountProfileBilling>;
  PersonalUserAccountProfileBillingUpdateInput: PersonalUserAccountProfileBillingUpdateInput;
  PersonalUserAccountProfileLocation: ResolverTypeWrapper<PersonalUserAccountProfileLocation>;
  PersonalUserAccountProfileLocationUpdateInput: PersonalUserAccountProfileLocationUpdateInput;
  PersonalUserAccountProfileUpdateInput: PersonalUserAccountProfileUpdateInput;
  PersonalUserAccountUpdateInput: PersonalUserAccountUpdateInput;
  PersonalUserRole: ResolverTypeWrapper<PersonalUserRole>;
  PersonalUserRoleConversationPermissions: ResolverTypeWrapper<PersonalUserRoleConversationPermissions>;
  PersonalUserRoleListingPermissions: ResolverTypeWrapper<PersonalUserRoleListingPermissions>;
  PersonalUserRolePermissions: ResolverTypeWrapper<PersonalUserRolePermissions>;
  PersonalUserRoleReservationRequestPermissions: ResolverTypeWrapper<PersonalUserRoleReservationRequestPermissions>;
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
  ReservationRequest: ResolverTypeWrapper<
    import("@sthrift/domain").Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
  >;
  ReservationRequestMutationResult: ResolverTypeWrapper<
    Omit<ReservationRequestMutationResult, "reservationRequest"> & { reservationRequest?: Maybe<ResolversTypes["ReservationRequest"]> }
  >;
  ReservationRequestState: ReservationRequestState;
  RoutingNumber: ResolverTypeWrapper<Scalars["RoutingNumber"]["output"]>;
  SESSN: ResolverTypeWrapper<Scalars["SESSN"]["output"]>;
  SafeInt: ResolverTypeWrapper<Scalars["SafeInt"]["output"]>;
  SemVer: ResolverTypeWrapper<Scalars["SemVer"]["output"]>;
  SorterInput: SorterInput;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Time: ResolverTypeWrapper<Scalars["Time"]["output"]>;
  TimeZone: ResolverTypeWrapper<Scalars["TimeZone"]["output"]>;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]["output"]>;
  URL: ResolverTypeWrapper<Scalars["URL"]["output"]>;
  USCurrency: ResolverTypeWrapper<Scalars["USCurrency"]["output"]>;
  UUID: ResolverTypeWrapper<Scalars["UUID"]["output"]>;
  UnsignedFloat: ResolverTypeWrapper<Scalars["UnsignedFloat"]["output"]>;
  UnsignedInt: ResolverTypeWrapper<Scalars["UnsignedInt"]["output"]>;
  User: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>["User"]>;
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
  Conversation: import("@sthrift/domain").Domain.Contexts.Conversation.Conversation.ConversationEntityReference;
  ConversationCreateInput: ConversationCreateInput;
  ConversationMutationResult: Omit<ConversationMutationResult, "conversation"> & { conversation?: Maybe<ResolversParentTypes["Conversation"]> };
  CountryCode: Scalars["CountryCode"]["output"];
  CountryName: Scalars["CountryName"]["output"];
  CreateItemListingInput: CreateItemListingInput;
  CreateReservationRequestInput: CreateReservationRequestInput;
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
  ID: Scalars["ID"]["output"];
  IP: Scalars["IP"]["output"];
  IPCPatent: Scalars["IPCPatent"]["output"];
  IPv4: Scalars["IPv4"]["output"];
  IPv6: Scalars["IPv6"]["output"];
  ISBN: Scalars["ISBN"]["output"];
  ISO8601Duration: Scalars["ISO8601Duration"]["output"];
  Int: Scalars["Int"]["output"];
  ItemListing: import("@sthrift/domain").Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
  JSON: Scalars["JSON"]["output"];
  JSONObject: Scalars["JSONObject"]["output"];
  JWT: Scalars["JWT"]["output"];
  LCCSubclass: Scalars["LCCSubclass"]["output"];
  Latitude: Scalars["Latitude"]["output"];
  Listing: ResolversUnionTypes<ResolversParentTypes>["Listing"];
  ListingAll: ListingAll;
  ListingAllPage: ListingAllPage;
  ListingRequest: ListingRequest;
  ListingRequestPage: ListingRequestPage;
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
  PersonalUser: import("@sthrift/domain").Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
  PersonalUserAccount: PersonalUserAccount;
  PersonalUserAccountProfile: PersonalUserAccountProfile;
  PersonalUserAccountProfileBilling: PersonalUserAccountProfileBilling;
  PersonalUserAccountProfileBillingUpdateInput: PersonalUserAccountProfileBillingUpdateInput;
  PersonalUserAccountProfileLocation: PersonalUserAccountProfileLocation;
  PersonalUserAccountProfileLocationUpdateInput: PersonalUserAccountProfileLocationUpdateInput;
  PersonalUserAccountProfileUpdateInput: PersonalUserAccountProfileUpdateInput;
  PersonalUserAccountUpdateInput: PersonalUserAccountUpdateInput;
  PersonalUserRole: PersonalUserRole;
  PersonalUserRoleConversationPermissions: PersonalUserRoleConversationPermissions;
  PersonalUserRoleListingPermissions: PersonalUserRoleListingPermissions;
  PersonalUserRolePermissions: PersonalUserRolePermissions;
  PersonalUserRoleReservationRequestPermissions: PersonalUserRoleReservationRequestPermissions;
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
  ReservationRequest: import("@sthrift/domain").Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;
  ReservationRequestMutationResult: Omit<ReservationRequestMutationResult, "reservationRequest"> & {
    reservationRequest?: Maybe<ResolversParentTypes["ReservationRequest"]>;
  };
  RoutingNumber: Scalars["RoutingNumber"]["output"];
  SESSN: Scalars["SESSN"]["output"];
  SafeInt: Scalars["SafeInt"]["output"];
  SemVer: Scalars["SemVer"]["output"];
  SorterInput: SorterInput;
  String: Scalars["String"]["output"];
  Time: Scalars["Time"]["output"];
  TimeZone: Scalars["TimeZone"]["output"];
  Timestamp: Scalars["Timestamp"]["output"];
  URL: Scalars["URL"]["output"];
  USCurrency: Scalars["USCurrency"]["output"];
  UUID: Scalars["UUID"]["output"];
  UnsignedFloat: Scalars["UnsignedFloat"]["output"];
  UnsignedInt: Scalars["UnsignedInt"]["output"];
  User: ResolversUnionTypes<ResolversParentTypes>["User"];
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
  indexTags?: Resolver<Maybe<ReadonlyArray<Maybe<ResolversTypes["BlobIndexTag"]>>>, ParentType, ContextType>;
  metadataFields?: Resolver<Maybe<ReadonlyArray<Maybe<ResolversTypes["BlobMetadataField"]>>>, ParentType, ContextType>;
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
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  listing?: Resolver<ResolversTypes["Listing"], ParentType, ContextType>;
  reserver?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  schemaVersion?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  sharer?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  twilioConversationId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConversationMutationResultResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ConversationMutationResult"] = ResolversParentTypes["ConversationMutationResult"],
> = ResolversObject<{
  conversation?: Resolver<Maybe<ResolversTypes["Conversation"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["MutationStatus"], ParentType, ContextType>;
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
  images?: Resolver<Maybe<ReadonlyArray<ResolversTypes["String"]>>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  reports?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  sharer?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  sharingHistory?: Resolver<Maybe<ReadonlyArray<ResolversTypes["String"]>>, ParentType, ContextType>;
  sharingPeriodEnd?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  sharingPeriodStart?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<"ItemListing", ParentType, ContextType>;
}>;

export type ListingAllResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ListingAll"] = ResolversParentTypes["ListingAll"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pendingRequestsCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  publishedAt?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  reservationPeriod?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingAllPageResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ListingAllPage"] = ResolversParentTypes["ListingAllPage"],
> = ResolversObject<{
  items?: Resolver<ReadonlyArray<ResolversTypes["ListingAll"]>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageSize?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  total?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingRequestResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ListingRequest"] = ResolversParentTypes["ListingRequest"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  requestedBy?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  requestedOn?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  reservationPeriod?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListingRequestPageResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["ListingRequestPage"] = ResolversParentTypes["ListingRequestPage"],
> = ResolversObject<{
  items?: Resolver<ReadonlyArray<ResolversTypes["ListingRequest"]>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  pageSize?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  total?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<"Conversation" | "ItemListing" | "PersonalUser" | "PersonalUserRole", ParentType, ContextType>;
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
  createConversation?: Resolver<
    ResolversTypes["ConversationMutationResult"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateConversationArgs, "input">
  >;
  createItemListing?: Resolver<ResolversTypes["ItemListing"], ParentType, ContextType, RequireFields<MutationCreateItemListingArgs, "input">>;
  createReservationRequest?: Resolver<
    ResolversTypes["ReservationRequest"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateReservationRequestArgs, "input">
  >;
  personalUserUpdate?: Resolver<ResolversTypes["PersonalUser"], ParentType, ContextType, RequireFields<MutationPersonalUserUpdateArgs, "input">>;
  processPayment?: Resolver<ResolversTypes["PaymentResponse"], ParentType, ContextType, RequireFields<MutationProcessPaymentArgs, "request">>;
  refundPayment?: Resolver<ResolversTypes["RefundResponse"], ParentType, ContextType, RequireFields<MutationRefundPaymentArgs, "request">>;
}>;

export type MutationResultResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["MutationResult"] = ResolversParentTypes["MutationResult"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<"ConversationMutationResult" | "ReservationRequestMutationResult", ParentType, ContextType>;
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
  hasCompletedOnboarding?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  isBlocked?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes["PersonalUserRole"]>, ParentType, ContextType>;
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
  paymentState?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
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

export type PersonalUserRoleResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUserRole"] = ResolversParentTypes["PersonalUserRole"],
> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  isDefault?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes["PersonalUserRolePermissions"]>, ParentType, ContextType>;
  roleName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  roleType?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserRoleConversationPermissionsResolvers<
  ContextType = GraphContext,
  ParentType extends
    ResolversParentTypes["PersonalUserRoleConversationPermissions"] = ResolversParentTypes["PersonalUserRoleConversationPermissions"],
> = ResolversObject<{
  canCreateConversation?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canManageConversation?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canViewConversation?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserRoleListingPermissionsResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUserRoleListingPermissions"] = ResolversParentTypes["PersonalUserRoleListingPermissions"],
> = ResolversObject<{
  canCreateItemListing?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canDeleteItemListing?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canPublishItemListing?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canUnpublishItemListing?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canUpdateItemListing?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canViewItemListing?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserRolePermissionsResolvers<
  ContextType = GraphContext,
  ParentType extends ResolversParentTypes["PersonalUserRolePermissions"] = ResolversParentTypes["PersonalUserRolePermissions"],
> = ResolversObject<{
  conversationPermissions?: Resolver<Maybe<ResolversTypes["PersonalUserRoleConversationPermissions"]>, ParentType, ContextType>;
  listingPermissions?: Resolver<Maybe<ResolversTypes["PersonalUserRoleListingPermissions"]>, ParentType, ContextType>;
  reservationRequestPermissions?: Resolver<Maybe<ResolversTypes["PersonalUserRoleReservationRequestPermissions"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonalUserRoleReservationRequestPermissionsResolvers<
  ContextType = GraphContext,
  ParentType extends
    ResolversParentTypes["PersonalUserRoleReservationRequestPermissions"] = ResolversParentTypes["PersonalUserRoleReservationRequestPermissions"],
> = ResolversObject<{
  canCreateReservationRequest?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canManageReservationRequest?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  canViewReservationRequest?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
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
  conversation?: Resolver<Maybe<ResolversTypes["Conversation"]>, ParentType, ContextType, RequireFields<QueryConversationArgs, "conversationId">>;
  conversationsByUser?: Resolver<
    Maybe<ReadonlyArray<Maybe<ResolversTypes["Conversation"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryConversationsByUserArgs, "userId">
  >;
  currentPersonalUserAndCreateIfNotExists?: Resolver<ResolversTypes["PersonalUser"], ParentType, ContextType>;
  itemListing?: Resolver<Maybe<ResolversTypes["ItemListing"]>, ParentType, ContextType, RequireFields<QueryItemListingArgs, "id">>;
  itemListings?: Resolver<ReadonlyArray<ResolversTypes["ItemListing"]>, ParentType, ContextType>;
  myActiveReservationForListing?: Resolver<
    Maybe<ResolversTypes["ReservationRequest"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMyActiveReservationForListingArgs, "listingId" | "userId">
  >;
  myActiveReservations?: Resolver<
    ReadonlyArray<ResolversTypes["ReservationRequest"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMyActiveReservationsArgs, "userId">
  >;
  myListingsAll?: Resolver<ResolversTypes["ListingAllPage"], ParentType, ContextType, RequireFields<QueryMyListingsAllArgs, "page" | "pageSize">>;
  myListingsRequests?: Resolver<
    ResolversTypes["ListingRequestPage"],
    ParentType,
    ContextType,
    RequireFields<QueryMyListingsRequestsArgs, "page" | "pageSize" | "searchText" | "sharerId" | "sorter" | "statusFilters">
  >;
  myPastReservations?: Resolver<
    ReadonlyArray<ResolversTypes["ReservationRequest"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMyPastReservationsArgs, "userId">
  >;
  overlapActiveReservationRequestsForListing?: Resolver<
    ReadonlyArray<ResolversTypes["ReservationRequest"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOverlapActiveReservationRequestsForListingArgs, "listingId" | "reservationPeriodEnd" | "reservationPeriodStart">
  >;
  personalUserById?: Resolver<Maybe<ResolversTypes["PersonalUser"]>, ParentType, ContextType, RequireFields<QueryPersonalUserByIdArgs, "id">>;
  queryActiveByListingId?: Resolver<
    ReadonlyArray<Maybe<ResolversTypes["ReservationRequest"]>>,
    ParentType,
    ContextType,
    RequireFields<QueryQueryActiveByListingIdArgs, "listingId">
  >;
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
  closeRequestedByReserver?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  closeRequestedBySharer?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ObjectID"], ParentType, ContextType>;
  listing?: Resolver<Maybe<ResolversTypes["ItemListing"]>, ParentType, ContextType>;
  reservationPeriodEnd?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  reservationPeriodStart?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  reserver?: Resolver<Maybe<ResolversTypes["PersonalUser"]>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["ReservationRequestState"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<"PersonalUser", ParentType, ContextType>;
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
  ConversationMutationResult?: ConversationMutationResultResolvers<ContextType>;
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
  ListingAll?: ListingAllResolvers<ContextType>;
  ListingAllPage?: ListingAllPageResolvers<ContextType>;
  ListingRequest?: ListingRequestResolvers<ContextType>;
  ListingRequestPage?: ListingRequestPageResolvers<ContextType>;
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
  PersonalUserRole?: PersonalUserRoleResolvers<ContextType>;
  PersonalUserRoleConversationPermissions?: PersonalUserRoleConversationPermissionsResolvers<ContextType>;
  PersonalUserRoleListingPermissions?: PersonalUserRoleListingPermissionsResolvers<ContextType>;
  PersonalUserRolePermissions?: PersonalUserRolePermissionsResolvers<ContextType>;
  PersonalUserRoleReservationRequestPermissions?: PersonalUserRoleReservationRequestPermissionsResolvers<ContextType>;
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
