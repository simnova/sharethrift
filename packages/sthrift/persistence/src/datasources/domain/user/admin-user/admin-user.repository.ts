import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';

export class AdminUserRepository<
		PropType extends Domain.Contexts.User.AdminUser.AdminUserProps,
	>
	extends MongooseSeedwork.MongoRepositoryBase<
		Models.User.AdminUser,
		PropType,
		Domain.Passport,
		Domain.Contexts.User.AdminUser.AdminUser<PropType>
	>
	implements Domain.Contexts.User.AdminUser.AdminUserRepository<PropType>
{
	async getById(
		id: string,
	): Promise<Domain.Contexts.User.AdminUser.AdminUser<PropType>> {
		const user = await this.model.findOne({ _id: id }).exec();
		if (!user) {
			throw new Error(`AdminUser with id ${id} not found`);
		}
		return this.typeConverter.toDomain(user, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		email: string,
		username: string,
		firstName: string,
		lastName: string,
	): Promise<Domain.Contexts.User.AdminUser.AdminUser<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.User.AdminUser.AdminUser.getNewInstance(
				adapter,
				this.passport,
				email,
				username,
				firstName,
				lastName,
			),
		);
	}
}
