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
			Domain.Contexts.AppealRequest.UserAppealRequest
				.UserAppealRequest<UserAppealRequestDomainAdapter>,
		);
	}
}

export class UserAppealRequestDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.AppealRequest.UserAppealRequest>
	implements
		Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestProps
{
	get user(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		if (!this.doc.user) {
			throw new Error('user is not populated');
		}
		if (this.doc.user instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.user.toString(),
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.user as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	async loadUser(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.user) {
			throw new Error('user is not populated');
		}
		if (this.doc.user instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('user');
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.user as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	set user(user:
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,) {
		if (!user?.id) {
			throw new Error('user reference is missing id');
		}
		this.doc.set('user', new MongooseSeedwork.ObjectId(user.id));
	}

	get blocker(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		if (!this.doc.blocker) {
			throw new Error('blocker is not populated');
		}
		if (this.doc.blocker instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.blocker.toString(),
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.blocker as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	async loadBlocker(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.blocker) {
			throw new Error('blocker is not populated');
		}
		if (this.doc.blocker instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('blocker');
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.blocker as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	set blocker(blocker:
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,) {
		if (!blocker?.id) {
			throw new Error('blocker reference is missing id');
		}
		this.doc.set('blocker', new MongooseSeedwork.ObjectId(blocker.id));
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
