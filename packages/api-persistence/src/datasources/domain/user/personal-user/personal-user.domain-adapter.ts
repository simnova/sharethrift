import { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

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
		if (!this.props.location) {
			this.props.set('location', {});
		}
		return new PersonalUserAccountProfileLocationDomainAdapter(
			this.props.location,
		);
	}
	get billing() {
		if (!this.props.billing) {
			this.props.set('billing', {});
		}
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
	get subscriptionId(): string | undefined {
		return this.props.subscriptionId;
	}
	set subscriptionId(value: string) {
		this.props.subscriptionId = value;
	}
	get cybersourceCustomerId(): string | undefined {
		return this.props.cybersourceCustomerId;
	}
	set cybersourceCustomerId(value: string) {
		this.props.cybersourceCustomerId = value;
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
		return this.props.address1;
	}
	set address1(value: string) {
		this.props.address1 = value;
	}
	get address2(): string | undefined {
		return this.props.address2;
	}
	set address2(value: string) {
		this.props.address2 = value;
	}
	get city() {
		return this.props.city;
	}
	set city(value: string) {
		this.props.city = value;
	}
	get state() {
		return this.props.state;
	}
	set state(value: string) {
		this.props.state = value;
	}
	get country() {
		return this.props.country;
	}
	set country(value: string) {
		this.props.country = value;
	}
	get zipCode() {
		return this.props.zipCode;
	}
	set zipCode(value: string) {
		this.props.zipCode = value;
	}

	// Nested Path Getters

	// Populated Doc Getters and Setters

	// Document Array Getters
}

// Document Array Domain Adapters
