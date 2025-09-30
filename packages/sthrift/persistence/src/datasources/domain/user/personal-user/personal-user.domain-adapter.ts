import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

import { PersonalUserRoleDomainAdapter } from '../../role/personal-user-role/personal-user-role.domain-adapter.ts';
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
			role: this.role,
			account: {
				accountType: this.account.accountType,
				email: this.account.email,
				username: this.account.username,
				profile: {
					firstName: this.account.profile.firstName,
					lastName: this.account.profile.lastName,
					location: this.account.profile.location,
					billing: {
						cybersourceCustomerId:
							this.account.profile.billing.cybersourceCustomerId,
						subscription: this.account.profile.billing.subscription,
						transactions: this.account.profile.billing.transactions.items.map(
							(tx) => ({
								id: tx.id,
								transactionId: tx.transactionId,
								amount: tx.amount,
								referenceId: tx.referenceId,
								status: tx.status,
								completedAt: tx.completedAt,
								errorMessage: tx.errorMessage,
							}),
						),
					},
				},
			},
			loadRole: this.loadRole.bind(this),
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

	get role(): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleProps {
		if (!this.doc.role) {
			throw new Error('role is not populated');
		}
		if (this.doc.role instanceof MongooseSeedwork.ObjectId) {
			throw new Error('role is not populated or is not of the correct type');
		}
		return new PersonalUserRoleDomainAdapter(
			this.doc.role as Models.Role.PersonalUserRole,
		);
	}
	async loadRole(): Promise<Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleProps> {
		if (!this.doc.role) {
			throw new Error('role is not populated');
		}
		if (this.doc.role instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('role');
		}
		return new PersonalUserRoleDomainAdapter(
			this.doc.role as Models.Role.PersonalUserRole,
		);
	}
	set role(role:
		| Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleEntityReference
		| Domain.Contexts.Role.PersonalUserRole.PersonalUserRole<PersonalUserRoleDomainAdapter>) {
		if (
			role instanceof Domain.Contexts.Role.PersonalUserRole.PersonalUserRole
		) {
			this.doc.set('role', role.props.doc);
			return;
		}
		if (!role?.id) {
			throw new Error('role reference is missing id');
		}
		this.doc.set('role', new MongooseSeedwork.ObjectId(role.id));
	}

	get account() {
		if (!this.doc.account) {
			this.doc.set('account', {});
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
export class PersonalUserAccountDomainAdapter
	implements Domain.Contexts.User.PersonalUser.PersonalUserAccountProps
{
	private readonly props: Models.User.PersonalUserAccount;

	constructor(props: Models.User.PersonalUserAccount) {
		this.props = props;
	}

	//Primitive Field Getters and Setters
	get accountType() {
		return this.props.accountType;
	}
	set accountType(value: string) {
		this.props.accountType = value;
	}
	get email() {
		return this.props.email;
	}
	set email(value: string) {
		this.props.email = value;
	}
	get username() {
		return this.props.username;
	}
	set username(value: string) {
		this.props.username = value;
	}

	// Nested Path Getters
	get profile() {
		if (!this.props.profile) {
			this.props.set('profile', {});
		}
		return new PersonalUserAccountProfileDomainAdapter(this.props.profile);
	}

	// Populated Doc Getters and Setters

	// Document Array Getters
}
export class PersonalUserAccountProfileDomainAdapter
	implements Domain.Contexts.User.PersonalUser.PersonalUserProfileProps
{
	private readonly props: Models.User.PersonalUserAccountProfile;

	constructor(props: Models.User.PersonalUserAccountProfile) {
		this.props = props;
	} //Primitive Field Getters and Setters
	get firstName() {
		return this.props.firstName;
	}
	set firstName(value: string) {
		this.props.firstName = value;
	}
	get lastName() {
		return this.props.lastName;
	}
	set lastName(value: string) {
		this.props.lastName = value;
	}

	// Nested Path Getters
	get location() {
		// commented out for it is causing runtime error: this.props.set is not a function
		// if (!this.props.location) {
		// 	this.props.set('location', {});
		// }
		return new PersonalUserAccountProfileLocationDomainAdapter(
			this.props.location,
		);
	}
	get billing() {
		// commented out for it is causing runtime error: this.props.set is not a function
		// if (!this.props.billing) {
		// 	this.props.set('billing', {});
		// }
		return new PersonalUserAccountProfileBillingDomainAdapter(
			this.props.billing,
		);
	}

	// Populated Doc Getters and Setters

	// Document Array Getters
}
export class PersonalUserAccountProfileBillingDomainAdapter
	implements
		Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingProps
{
	private readonly props: Models.User.PersonalUserAccountProfileBilling;
	constructor(props: Models.User.PersonalUserAccountProfileBilling) {
		this.props = props;
	}
	//Primitive Field Getters and Setters
	get cybersourceCustomerId(): string | null {
		return this.props.cybersourceCustomerId;
	}
	set cybersourceCustomerId(value: string) {
		this.props.cybersourceCustomerId = value;
	}

	// Nested Path Getters

	get subscription() {
		if (!this.props.subscription) {
			this.props.set('subscription', {});
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

export class PersonalUserAccountProfileBillingSubscriptionDomainAdapter
	implements
		Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileBillingSubscriptionProps
{
	private readonly props: Models.User.PersonalUserAccountProfileBillingSubscription;
	constructor(
		props: Models.User.PersonalUserAccountProfileBillingSubscription,
	) {
		this.props = props;
	}
	//Primitive Field Getters and Setters
	get subscriptionCode(): string {
		return this.props.subscriptionCode;
	}
	set subscriptionCode(value: string) {
		this.props.subscriptionCode = value;
	}
	get planCode(): string {
		return this.props.planCode;
	}
	set planCode(value: string) {
		this.props.planCode = value;
	}
	get status(): string {
		return this.props.status;
	}
	set status(value: string) {
		this.props.status = value;
	}
	get startDate(): Date {
		return this.props.startDate;
	}
	set startDate(value: Date) {
		this.props.startDate = value;
	}

	// Nested Path Getters

	// Populated Doc Getters and Setters

	// Document Array Getters
}

export class PersonalUserAccountProfileBillingTransactionsDomainAdapter
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

	// Nested Path Getters

	// Populated Doc Getters and Setters
	// Document Array Getters
}

export class PersonalUserAccountProfileLocationDomainAdapter
	implements
		Domain.Contexts.User.PersonalUser.PersonalUserAccountProfileLocationProps
{
	private readonly props: Models.User.PersonalUserAccountProfileLocation;
	constructor(props: Models.User.PersonalUserAccountProfileLocation) {
		this.props = props;
	} //Primitive Field Getters and Setters
	get address1() {
		return this.props?.address1;
	}
	set address1(value: string) {
		this.props.address1 = value;
	}
	get address2(): string | null {
		return this.props?.address2;
	}
	set address2(value: string) {
		this.props.address2 = value;
	}
	get city() {
		return this.props?.city;
	}
	set city(value: string) {
		this.props.city = value;
	}
	get state() {
		return this.props?.state;
	}
	set state(value: string) {
		this.props.state = value;
	}
	get country() {
		return this.props?.country;
	}
	set country(value: string) {
		this.props.country = value;
	}
	get zipCode() {
		return this.props?.zipCode;
	}
	set zipCode(value: string) {
		this.props.zipCode = value;
	}

	// Nested Path Getters

	// Populated Doc Getters and Setters

	// Document Array Getters
}

// Document Array Domain Adapters
