import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import { createStringAccessors } from '../user-adapter.helpers.js';

export class PersonalUserConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.User.PersonalUser,
	PersonalUserDomainAdapter,
	Domain.Passport,
	Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>
> {
	constructor() {
		super(
			PersonalUserDomainAdapter,
			Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
		);
	}
}

export class PersonalUserDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.User.PersonalUser>
	implements Domain.Contexts.User.PersonalUser.PersonalUserProps
{
	public get entityReference(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		return {
			id: this.id,
			userType: this.userType,
			isBlocked: this.isBlocked,
			hasCompletedOnboarding: this.hasCompletedOnboarding,
			account: {
				accountType: this.account.accountType,
				email: this.account.email,
				username: this.account.username,
				profile: {
					aboutMe: this.account.profile.aboutMe,
					firstName: this.account.profile.firstName,
					lastName: this.account.profile.lastName,
					location: this.account.profile.location,
				billing: {
					cybersourceCustomerId:
						this.account.profile.billing.cybersourceCustomerId,
					subscription: this.account.profile.billing.subscription,
					transactions: (() => {
						try {
							return this.account.profile.billing.transactions?.items?.map(
								(tx) => ({
									id: tx.id,
									transactionId: tx.transactionId,
									amount: tx.amount,
									referenceId: tx.referenceId,
									status: tx.status,
									completedAt: tx.completedAt,
									errorMessage: tx.errorMessage,
								}),
							) || [];
						} catch {
							return [];
						}
					})(),
				},
				},
			},
			schemaVersion: this.doc.schemaVersion,
			createdAt: this.doc.createdAt,
			updatedAt: this.doc.updatedAt,
		};
	}
	get userType() {
		return this.doc.userType;
	}
	set userType(value: string) {
		this.doc.userType = value;
	}
	get isBlocked() {
		return this.doc.isBlocked;
	}
	set isBlocked(value: boolean) {
		this.doc.isBlocked = value;
	}

	get account() {
		if (!this.doc.account) {
			// this.doc.set('account', {}); 
      this.doc.account = {} as Models.User.PersonalUserAccount;
		}
		return new PersonalUserAccountDomainAdapter(this.doc.account);
	}

	get hasCompletedOnboarding() {
		return this.doc.hasCompletedOnboarding;
	}
	set hasCompletedOnboarding(value: boolean) {
		this.doc.hasCompletedOnboarding = value;
	}
}

// Nested Path Domain Adapters
class PersonalUserAccountDomainAdapter
	implements Domain.Contexts.User.PersonalUser.PersonalUserAccountProps
{
	private readonly props: Models.User.PersonalUserAccount;
	accountType!: string;
	email!: string;
	username!: string;

	constructor(props: Models.User.PersonalUserAccount) {
		this.props = props;
		createStringAccessors(this, ['accountType', 'email', 'username']);
	}

	get profile() {
		if (!this.props.profile) {
			this.props.profile = {} as Models.User.PersonalUserAccountProfile;
		}
		return new PersonalUserAccountProfileDomainAdapter(this.props.profile);
	}
}
class PersonalUserAccountProfileDomainAdapter
	implements Domain.Contexts.User.PersonalUser.PersonalUserProfileProps
{
	readonly props: Models.User.PersonalUserAccountProfile;
	firstName!: string;
	lastName!: string;
	aboutMe!: string;

	constructor(props: Models.User.PersonalUserAccountProfile) {
		this.props = props;
		createStringAccessors(this, ['firstName', 'lastName', 'aboutMe']);
	}

	get location() {
		if (!this.props.location) {
			this.props.location =
				{} as Models.User.PersonalUserAccountProfileLocation;
		}
		return new PersonalUserAccountProfileLocationDomainAdapter(
			this.props.location,
		);
	}
	get billing() {
		if (!this.props.billing) {
			this.props.billing = {} as Models.User.PersonalUserAccountProfileBilling;
		}
		return new PersonalUserAccountProfileBillingDomainAdapter(
			this.props.billing,
		);
	}

	// Populated Doc Getters and Setters

	// Document Array Getters
}
class PersonalUserAccountProfileBillingDomainAdapter
	implements
		Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingProps
{
	readonly props: Models.User.PersonalUserAccountProfileBilling;
	cybersourceCustomerId!: string | null;

	constructor(props: Models.User.PersonalUserAccountProfileBilling) {
		this.props = props;
		createStringAccessors(this, ['cybersourceCustomerId']);
	}

	get subscription() {
		if (!this.props.subscription) {
			this.props.subscription =
				{} as Models.User.PersonalUserAccountProfileBillingSubscription;
		}
		return new PersonalUserAccountProfileBillingSubscriptionDomainAdapter(
			this.props.subscription,
		);
	}

	// Populated Doc Getters and Setters

	// Document Array Getters
	get transactions(): DomainSeedwork.PropArray<Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingTransactionsEntityReference> {
		return new MongooseSeedwork.MongoosePropArray(
			this.props.transactions,
			PersonalUserAccountProfileBillingTransactionsDomainAdapter,
		);
	}
}

class PersonalUserAccountProfileBillingSubscriptionDomainAdapter
	implements
		Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingSubscriptionProps
{
	readonly props: Models.User.PersonalUserAccountProfileBillingSubscription;
	subscriptionId!: string;
	planCode!: string;
	status!: string;
	startDate!: Date;

	constructor(
		props: Models.User.PersonalUserAccountProfileBillingSubscription,
	) {
		this.props = props;
		createStringAccessors(this, [
			'subscriptionId',
			'planCode',
			'status',
			'startDate',
		]);
	}
}

class PersonalUserAccountProfileBillingTransactionsDomainAdapter
	implements
		Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingTransactionsProps
{
	public readonly doc: Models.User.PersonalUserAccountProfileBillingTransactions;

	constructor(doc: Models.User.PersonalUserAccountProfileBillingTransactions) {
		this.doc = doc;
	}

	public get id(): string {
		return this.doc.id?.valueOf() as string;
	}

	//Primitive Field Getters and Setters
	get transactionId(): string {
		return this.doc.transactionId;
	}
	set transactionId(value: string) {
		this.doc.transactionId = value;
	}
	get amount(): number {
		return this.doc.amount;
	}
	set amount(value: number) {
		this.doc.amount = value;
	}
	get referenceId(): string {
		return this.doc.referenceId;
	}
	set referenceId(value: string) {
		this.doc.referenceId = value;
	}
	get status(): string {
		return this.doc.status;
	}
	set status(value: string) {
		this.doc.status = value;
	}
	get completedAt(): Date {
		return this.doc.completedAt;
	}
	set completedAt(value: Date) {
		this.doc.completedAt = value;
	}
	get errorMessage(): string | null {
		return this.doc.errorMessage;
	}
	set errorMessage(value: string) {
		this.doc.errorMessage = value;
	}
}

class PersonalUserAccountProfileLocationDomainAdapter
	implements
		Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileLocationProps
{
	readonly props: Models.User.PersonalUserAccountProfileLocation;
	address1!: string;
	address2!: string | null;
	city!: string;
	state!: string;
	country!: string;
	zipCode!: string;

	constructor(props: Models.User.PersonalUserAccountProfileLocation) {
		this.props = props;

		// Nested Path Getters

		// Populated Doc Getters and Setters

		// Document Array Getters
		createStringAccessors(this, [
			'address1',
			'address2',
			'city',
			'state',
			'country',
			'zipCode',
		]);
	}
}

// Document Array Domain Adapters
