import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';

export class UserAppealRequestConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.AppealRequest.UserAppealRequest,
	UserAppealRequestDomainAdapter,
	Domain.Passport,
	Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequest<UserAppealRequestDomainAdapter>
> {
	constructor() {
		super(
			UserAppealRequestDomainAdapter,
			Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequest<UserAppealRequestDomainAdapter>,
		);
	}
}

export class UserAppealRequestDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.AppealRequest.UserAppealRequest>
	implements
		Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestProps
{
	get user(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		return this.ref('user', PersonalUserDomainAdapter);
	}

	set user(
		user:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
	) {
		this.ref('user', PersonalUserDomainAdapter, user);
	}

	get blocker(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		return this.ref('blocker', PersonalUserDomainAdapter);
	}

	set blocker(
		blocker:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
	) {
		this.ref('blocker', PersonalUserDomainAdapter, blocker);
	}

	get reason(): string {
		return this.doc.reason;
	}

	set reason(value: string) {
		this.doc.reason = value;
	}

	get state(): string {
		return this.doc.state;
	}

	set state(value: string) {
		this.doc.state = value as 'requested' | 'denied' | 'accepted';
	}

	get type(): string {
		return this.doc.type;
	}
}
