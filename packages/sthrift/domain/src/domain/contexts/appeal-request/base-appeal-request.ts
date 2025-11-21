import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { AppealRequestVisa } from './appeal-request.visa.ts';
import * as ValueObjects from './listing-appeal-request/listing-appeal-request.value-objects.ts';
import type { BaseAppealRequestProps } from './base-appeal-request.entity.ts';
import type { PersonalUserEntityReference } from '../user/personal-user/personal-user.entity.ts';
import { PersonalUser } from '../user/personal-user/personal-user.ts';

/**
 * Base abstract class for appeal request aggregates.
 * Contains shared logic for user appeals and listing appeals.
 */
export abstract class AppealRequestBase<props extends BaseAppealRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
{
	protected readonly visa: AppealRequestVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = this.createVisa(passport);
	}

	/**
	 * Abstract method to be implemented by subclasses to create the appropriate visa.
	 * @param passport - The passport to use for visa creation
	 */
	protected abstract createVisa(passport: Passport): AppealRequestVisa;

	get user(): PersonalUserEntityReference {
		return new PersonalUser(
			// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
			this.props.user as any,
			this.passport,
		) as PersonalUserEntityReference;
	}

	async loadUser(): Promise<PersonalUserEntityReference> {
		return await this.props.loadUser();
	}

	get reason(): string {
		return this.props.reason;
	}
	
	set reason(value: string) {
		if (
			!this.visa.determineIf(
				(permissions) => permissions.canUpdateAppealRequestState,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update the reason',
			);
		}
		this.props.reason = new ValueObjects.Reason(value).valueOf();
	}

	get state(): string {
		return this.props.state;
	}
	
	set state(value: string) {
		if (
			!this.visa.determineIf(
				(permissions) => permissions.canUpdateAppealRequestState,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update the state',
			);
		}
		this.props.state = new ValueObjects.State(value).valueOf();
	}

	get type(): string {
		return this.props.type;
	}

	get blocker(): PersonalUserEntityReference {
		return new PersonalUser(
			// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
			this.props.blocker as any,
			this.passport,
		) as PersonalUserEntityReference;
	}

	async loadBlocker(): Promise<PersonalUserEntityReference> {
		return await this.props.loadBlocker();
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get schemaVersion(): string {
		return this.props.schemaVersion;
	}
}
