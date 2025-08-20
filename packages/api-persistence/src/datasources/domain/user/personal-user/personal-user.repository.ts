import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Domain } from '@sthrift/api-domain';
import type { PersonalUserModelType } from '@sthrift/api-data-sources-mongoose-models';
import { PersonalUserDomainAdapter } from './personal-user.domain-adapter.ts';

export class PersonalUserRepositoryImpl<props extends Domain.Contexts.User.PersonalUser.PersonalUserProps>
	extends MongooseSeedwork.MongoRepositoryBase<
		Domain.Contexts.User.PersonalUser.PersonalUser<props>,
		PersonalUserModelType,
		props
	>
	implements Domain.Contexts.User.PersonalUser.PersonalUserRepository<props>
{
	constructor(model: PersonalUserModelType) {
		super(model, new PersonalUserDomainAdapter());
	}

	getNewInstance(name: string): Promise<Domain.Contexts.User.PersonalUser.PersonalUser<props>> {
		// Create new instance with minimal required properties
		// The name parameter might be used for username or display name
		const newProps = {
			id: this.model.createObjectId().toString(),
			userType: 'personal',
			isBlocked: false,
			schemaVersion: '1.0.0',
			account: {
				accountType: 'personal',
				email: `${name}@example.com`, // This should be replaced with actual email
				username: name,
				profile: {
					firstName: '',
					lastName: '',
					location: {
						address1: '',
						city: '',
						state: '',
						country: '',
						zipCode: '',
					},
				},
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		} as props;

		// For now, create a mock passport - this should be replaced with actual passport
		const mockPassport = { user: { forPersonalUser: () => ({}) } } as unknown as Domain.Passport;
		return Promise.resolve(this.getAdapter().toDomain(newProps, mockPassport));
	}

	async getById(id: string): Promise<Domain.Contexts.User.PersonalUser.PersonalUser<props>> {
		const document = await this.model.findById(id);
		if (!document) {
			throw new Error(`PersonalUser with id ${id} not found`);
		}
		const mockPassport = { user: { forPersonalUser: () => ({}) } } as unknown as Domain.Passport;
		return this.getAdapter().toDomain(document.toObject(), mockPassport);
	}

	async getAll(): Promise<Domain.Contexts.User.PersonalUser.PersonalUser<props>[]> {
		const documents = await this.model.find({});
		const mockPassport = { user: { forPersonalUser: () => ({}) } } as unknown as Domain.Passport;
		return documents.map((doc) => 
			this.getAdapter().toDomain(doc.toObject(), mockPassport)
		);
	}

	async getByEmail(email: string): Promise<Domain.Contexts.User.PersonalUser.PersonalUser<props> | null> {
		const document = await this.model.findOne({ 'account.email': email });
		if (!document) {
			return null;
		}
		const mockPassport = { user: { forPersonalUser: () => ({}) } } as unknown as Domain.Passport;
		return this.getAdapter().toDomain(document.toObject(), mockPassport);
	}

	async getByUsername(username: string): Promise<Domain.Contexts.User.PersonalUser.PersonalUser<props> | null> {
		const document = await this.model.findOne({ 'account.username': username });
		if (!document) {
			return null;
		}
		const mockPassport = { user: { forPersonalUser: () => ({}) } } as unknown as Domain.Passport;
		return this.getAdapter().toDomain(document.toObject(), mockPassport);
	}
}