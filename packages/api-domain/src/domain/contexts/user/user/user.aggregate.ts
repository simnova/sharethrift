import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserPassport } from '../user.passport.ts';
import type { UserVisa } from '../user.visa.ts';
import * as ValueObjects from './user.value-objects.ts';

/**
 * Domain events for User aggregate
 */
export class UserCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<{
	userId: string;
	userType: ValueObjects.UserType;
	accountType: ValueObjects.AccountType;
	email: string;
	username: string;
}> {}

export class UserBlockStatusChangedEvent extends DomainSeedwork.CustomDomainEventImpl<{
	userId: string;
	isBlocked: boolean;
}> {}

export class UserEmailUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<{
	userId: string;
	email: string;
}> {}

export class UserProfileUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<{
	userId: string;
	field: string;
	value: string;
}> {}

export class UserLocationUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<{
	userId: string;
	location: LocationProps;
}> {}

export class UserBillingUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<{
	userId: string;
	billing: BillingProps;
}> {}

/**
 * Location nested path for user profile
 */
export interface LocationProps {
	address1: string;
	address2: string | undefined;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}

/**
 * Billing nested path for user profile
 */
export interface BillingProps {
	subscriptionId?: string;
	cybersourceCustomerId?: string;
}

/**
 * Profile nested path for user account
 */
export interface ProfileProps {
	firstName: string;
	lastName: string;
	location: LocationProps;
	billing?: BillingProps;
}

/**
 * Account nested path for user
 */
export interface AccountProps {
	accountType: ValueObjects.AccountType;
	email: string;
	username: string;
	profile: ProfileProps;
}

/**
 * User aggregate props interface
 */
export interface UserProps extends DomainSeedwork.DomainEntityProps {
	userType: ValueObjects.UserType;
	isBlocked: boolean;
	account: AccountProps;
	schemaVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * User entity reference interface for read-only access
 */
export interface UserEntityReference extends Readonly<UserProps> {}

/**
 * User aggregate root implementation
 */
export class User<props extends UserProps> 
	extends DomainSeedwork.AggregateRoot<props, UserPassport> 
		implements UserEntityReference {
	
	//#region Fields
	private isNew: boolean = false;
	private readonly visa: UserVisa;
	//#endregion Fields

	//#region Constructor
	constructor(props: props, passport: UserPassport) {
		super(props, passport);
		this.visa = passport.forUser(this);
	}
	//#endregion Constructor

	//#region Methods
	/**
	 * Creates a new user instance
	 * @param newProps User properties
	 * @param passport User passport for authorization
	 * @returns New user instance
	 */
	public static getNewInstance<props extends UserProps>(
		newProps: props,
		passport: UserPassport
	): User<props> {
		const user = new User(newProps, passport);
		user.markAsNew();
		user.isNew = false;
		return user;
	}

	private markAsNew(): void {
		this.isNew = true;
		// Emit integration event for user creation
		this.addIntegrationEvent(UserCreatedEvent, {
			userId: this.id,
			userType: this.userType,
			accountType: this.accountType,
			email: this.email,
			username: this.username
		});
	}
	//#endregion Methods

	//#region Properties
	get userType(): ValueObjects.UserType {
		return this.props.userType;
	}

	get isBlocked(): boolean {
		return this.props.isBlocked;
	}

	set isBlocked(value: boolean) {
		if (!this.isNew && !this.visa.determineIf(permissions => permissions.canBlockUser || permissions.isAdmin)) {
			throw new DomainSeedwork.PermissionError('You do not have permission to block/unblock users');
		}
		this.props.isBlocked = value;
		this.addDomainEvent(UserBlockStatusChangedEvent, {
			userId: this.id,
			isBlocked: value
		});
	}

	get account(): AccountProps {
		return this.props.account;
	}

	get accountType(): ValueObjects.AccountType {
		return this.props.account.accountType;
	}

	get email(): string {
		return this.props.account.email;
	}

	set email(value: string) {
		if (!this.visa.determineIf(permissions => permissions.canEditAccountSettings || permissions.isUserOwner)) {
			throw new DomainSeedwork.PermissionError('You do not have permission to update email');
		}
		this.props.account = {
			...this.props.account,
			email: new ValueObjects.Email(value).valueOf()
		};
		this.addDomainEvent(UserEmailUpdatedEvent, {
			userId: this.id,
			email: value
		});
	}

	get username(): string {
		return this.props.account.username;
	}

	// Username cannot be changed after creation per business rules
	get profile(): ProfileProps {
		return this.props.account.profile;
	}

	get firstName(): string {
		return this.props.account.profile.firstName;
	}

	set firstName(value: string) {
		if (!this.visa.determineIf(permissions => permissions.canEditUserProfile || permissions.isUserOwner)) {
			throw new DomainSeedwork.PermissionError('You do not have permission to update first name');
		}
		this.props.account = {
			...this.props.account,
			profile: {
				...this.props.account.profile,
				firstName: new ValueObjects.FirstName(value).valueOf()
			}
		};
		this.addDomainEvent(UserProfileUpdatedEvent, {
			userId: this.id,
			field: 'firstName',
			value
		});
	}

	get lastName(): string {
		return this.props.account.profile.lastName;
	}

	set lastName(value: string) {
		if (!this.visa.determineIf(permissions => permissions.canEditUserProfile || permissions.isUserOwner)) {
			throw new DomainSeedwork.PermissionError('You do not have permission to update last name');
		}
		this.props.account = {
			...this.props.account,
			profile: {
				...this.props.account.profile,
				lastName: new ValueObjects.LastName(value).valueOf()
			}
		};
		this.addDomainEvent(UserProfileUpdatedEvent, {
			userId: this.id,
			field: 'lastName',
			value
		});
	}

	get location(): LocationProps {
		return this.props.account.profile.location;
	}

	/**
	 * Updates the user's location information
	 */
	public updateLocation(location: LocationProps): void {
		if (!this.visa.determineIf(permissions => permissions.canEditUserProfile || permissions.isUserOwner)) {
			throw new DomainSeedwork.PermissionError('You do not have permission to update location');
		}

		// Validate location fields using value objects
		const validatedLocation: LocationProps = {
			address1: new ValueObjects.Address(location.address1).valueOf(),
			address2: location.address2 || undefined,
			city: new ValueObjects.City(location.city).valueOf(),
			state: new ValueObjects.State(location.state).valueOf(),
			country: new ValueObjects.Country(location.country).valueOf(),
			zipCode: new ValueObjects.ZipCode(location.zipCode).valueOf()
		};

		this.props.account = {
			...this.props.account,
			profile: {
				...this.props.account.profile,
				location: validatedLocation
			}
		};

		this.addDomainEvent(UserLocationUpdatedEvent, {
			userId: this.id,
			location: validatedLocation
		});
	}

	get billing(): BillingProps | undefined {
		return this.props.account.profile.billing;
	}

	/**
	 * Updates billing information
	 */
	public updateBilling(billing: BillingProps): void {
		if (!this.visa.determineIf(permissions => permissions.canEditBillingInfo || permissions.isUserOwner)) {
			throw new DomainSeedwork.PermissionError('You do not have permission to update billing information');
		}

		this.props.account = {
			...this.props.account,
			profile: {
				...this.props.account.profile,
				billing
			}
		};

		this.addDomainEvent(UserBillingUpdatedEvent, {
			userId: this.id,
			billing
		});
	}

	get schemaVersion(): string {
		return this.props.schemaVersion;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	//#endregion Properties
}