import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';

export class PersonalUserRepository<
		PropType extends Domain.Contexts.User.PersonalUser.PersonalUserProps,
	>
	extends MongooseSeedwork.MongoRepositoryBase<
		Models.User.PersonalUser,
		PropType,
		Domain.Passport,
		Domain.Contexts.User.PersonalUser.PersonalUser<PropType>
	>
	implements Domain.Contexts.User.PersonalUser.PersonalUserRepository<PropType>
{
	async getById(
		id: string,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUser<PropType>> {
		const user = await this.model.findOne({ _id: id }).exec();
		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}
		return this.typeConverter.toDomain(user, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		email: string,
		firstName: string,
		lastName: string,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUser<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.User.PersonalUser.PersonalUser.getNewInstance(
				adapter,
				this.passport,
				email,
				firstName,
				lastName,
			),
		);
	}
}
