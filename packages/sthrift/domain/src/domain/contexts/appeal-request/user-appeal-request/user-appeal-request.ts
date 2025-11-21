import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { AppealRequestVisa } from '../appeal-request.visa.ts';
import * as ValueObjects from './user-appeal-request.value-objects.ts';
import type {
	UserAppealRequestEntityReference,
	UserAppealRequestProps,
} from './user-appeal-request.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import * as AppealRequestHelpers from '../appeal-request.helpers.ts';

export class UserAppealRequest<props extends UserAppealRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements UserAppealRequestEntityReference
{
	private readonly visa: AppealRequestVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.appealRequest.forUserAppealRequest(this);
	}

	public static getNewInstance<props extends UserAppealRequestProps>(
		newProps: props,
		passport: Passport,
		userId: string,
		reason: string,
		blockerId: string,
	): UserAppealRequest<props> {
		const newInstance = new UserAppealRequest(newProps, passport);

		newInstance.props.user = { id: userId } as PersonalUserEntityReference;
		newInstance.reason = reason;
		newInstance.props.state = ValueObjects.AppealRequestState.REQUESTED;
		newInstance.props.type = ValueObjects.AppealRequestType.USER;
		newInstance.props.blocker = { id: blockerId } as PersonalUserEntityReference;

		return newInstance;
	}

	get user(): PersonalUserEntityReference {
		return AppealRequestHelpers.getUserReference(this.props.user, this.passport);
	}

	async loadUser(): Promise<PersonalUserEntityReference> {
		return await this.props.loadUser();
	}

	get reason(): string {
		return this.props.reason;
	}
	
	set reason(value: string) {
		AppealRequestHelpers.updateReason(this.props, value, this.visa, ValueObjects.Reason);
	}

	get state(): string {
		return this.props.state;
	}
	
	set state(value: string) {
		AppealRequestHelpers.updateState(this.props, value, this.visa, ValueObjects.State);
	}

	get type(): string {
		return this.props.type;
	}

	get blocker(): PersonalUserEntityReference {
		return AppealRequestHelpers.getBlockerReference(this.props.blocker, this.passport);
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
