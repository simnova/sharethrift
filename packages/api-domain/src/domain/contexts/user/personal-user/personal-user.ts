import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { UserVisa } from '../user.visa.ts';
import  { PersonalUserAccount, type PersonalUserAccountProps, type PersonalUserAccountEntityReference } from './personal-user-account.ts';

export interface PersonalUserProps extends DomainSeedwork.DomainEntityProps {
	userType: string;
	isBlocked: boolean;
	schemaVersion: string;

	readonly account: PersonalUserAccountProps;

	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface PersonalUserEntityReference
	extends Readonly<Omit<PersonalUserProps, 'account'>> {
	readonly account: PersonalUserAccountEntityReference;
}

export interface PersonalUserAggregateRoot
	extends DomainSeedwork.RootEventRegistry {
	get isNew(): boolean;
}

export class PersonalUser<props extends PersonalUserProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements PersonalUserEntityReference, PersonalUserAggregateRoot
{
	private _isNew: boolean = false;
	private readonly visa: UserVisa;
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forPersonalUser(this);
	}
	public static getNewInstance<props extends PersonalUserProps>(
		newProps: props,
		passport: Passport,
	): PersonalUser<props> {
		const newInstance = new PersonalUser(newProps, passport);
		newInstance.markAsNew();
		newInstance._isNew = true;
		//field assignments
		newInstance._isNew = false;
		return newInstance;
	}

	private markAsNew(): void {
		this._isNew = true;
		// this.addIntegrationEvent(PersonalUserCreatedEvent, { userId: this.props.id });
	}

	private validateVisa(): void {
		// if (
		// 	!this.isNew &&
		// 	!this.visa.determineIf(
		// 		(permissions) =>
		// 			permissions.isEditingOwnAccount || permissions.canManageEndUsers,
		// 	)
		// ) {
		// 	throw new DomainSeedwork.PermissionError('Unauthorized');
		// }
	}

	get isNew() {
		return this._isNew;
	}

	get userType(): string {
		return this.props.userType;
	}
	get isBlocked(): boolean {
		return this.props.isBlocked;
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

	get account(): PersonalUserAccount {
		return new PersonalUserAccount(this.props.account, this.visa, this);
	}

	set userType(value: string) {
		this.validateVisa();
		this.props.userType = value;
	}
	set isBlocked(value: boolean) {
		this.validateVisa();
		this.props.isBlocked = value;
	}
}
