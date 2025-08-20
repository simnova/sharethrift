import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Domain } from '@sthrift/api-domain';
import type { PersonalUserModelType } from '@sthrift/api-data-sources-mongoose-models';
import { PersonalUserConverter } from './personal-user.converter.ts';

export class PersonalUserDomainAdapter 
	extends MongooseSeedwork.MongooseDomainAdapter<
		Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>,
		PersonalUserModelType,
		Domain.Contexts.User.PersonalUser.PersonalUserProps
	> 
{
	constructor() {
		super(new PersonalUserConverter());
	}

	toDomain(
		doc: Domain.Contexts.User.PersonalUser.PersonalUserProps, 
		passport: Domain.Passport
	): Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps> {
		const convertedProps = this.getConverter().toDomain(doc);
		return Domain.Contexts.User.PersonalUser.PersonalUser.getNewInstance(convertedProps, passport);
	}

	toPersistence(domain: Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>): Domain.Contexts.User.PersonalUser.PersonalUserProps {
		return this.getConverter().toPersistence(domain.props);
	}
}