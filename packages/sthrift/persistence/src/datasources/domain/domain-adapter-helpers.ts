/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import type { PopulatedDoc, Schema } from 'mongoose';
import { PersonalUserDomainAdapter } from './user/personal-user/personal-user.domain-adapter.ts';

export const getSharer = (
	docSharer: Schema.Types.ObjectId | PopulatedDoc<Models.User.PersonalUser>,
): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference => {
	if (!docSharer) {
		throw new Error('sharer is not populated');
	}
	if (docSharer instanceof MongooseSeedwork.ObjectId) {
		return {
			id: docSharer.toString(),
		} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	}
	return new PersonalUserDomainAdapter(docSharer as Models.User.PersonalUser);
};

export const loadSharer = async <
	T extends {
		sharer?: Schema.Types.ObjectId | PopulatedDoc<Models.User.PersonalUser>;
	},
>(
	doc: T,
): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> => {
	if (!doc.sharer) {
		throw new Error('sharer is not populated');
	}
	if (doc.sharer instanceof MongooseSeedwork.ObjectId) {
		await (doc as any).populate('sharer');
	}
	return new PersonalUserDomainAdapter(doc.sharer as Models.User.PersonalUser);
};

export const setSharer = <
	T extends {
		sharer?: Schema.Types.ObjectId | PopulatedDoc<Models.User.PersonalUser>;
	},
>(
	doc: T,
	user: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
): void => {
	if (!user?.id) {
		throw new Error('user reference is missing id');
	}
	(doc as any).set('sharer', new MongooseSeedwork.ObjectId(user.id));
};

// reserver
export const getReserver = (
	docReserver: Schema.Types.ObjectId | PopulatedDoc<Models.User.PersonalUser>,
): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference => {
	if (!docReserver) {
		throw new Error('reserver is not populated');
	}
	if (docReserver instanceof MongooseSeedwork.ObjectId) {
		return {
			id: docReserver.toString(),
		} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	}
	return new PersonalUserDomainAdapter(docReserver as Models.User.PersonalUser);
};

export const loadReserver = async <
	T extends {
		reserver?: Schema.Types.ObjectId | PopulatedDoc<Models.User.PersonalUser>;
	},
>(
	doc: T,
): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> => {
	if (!doc.reserver) {
		throw new Error('reserver is not populated');
	}
	if (doc.reserver instanceof MongooseSeedwork.ObjectId) {
		await (doc as any).populate('reserver');
	}
	return new PersonalUserDomainAdapter(
		doc.reserver as Models.User.PersonalUser,
	);
};

export const setReserver = <
	T extends {
		reserver?: Schema.Types.ObjectId | PopulatedDoc<Models.User.PersonalUser>;
	},
>(
	doc: T,
	user: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
): void => {
	if (!user?.id) {
		throw new Error('user reference is missing id');
	}
	(doc as any).set('reserver', new MongooseSeedwork.ObjectId(user.id));
};
