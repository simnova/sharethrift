import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import type { AdminRoleDomainAdapter } from './admin-role.domain-adapter.ts';

type AdminRoleModelType = Models.Role.AdminRole;
type PropType = AdminRoleDomainAdapter;

export class AdminRoleRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		AdminRoleModelType,
		PropType,
		Domain.Passport,
		Domain.Contexts.Role.AdminRole.AdminRole<PropType>
	>
	implements Domain.Contexts.Role.AdminRole.AdminRoleRepository<PropType>
{
	async getById(
		id: string,
	): Promise<Domain.Contexts.Role.AdminRole.AdminRole<PropType>> {
		const mongoAdminRole = await this.model.findById(id).exec();
		if (!mongoAdminRole) {
			throw new Error(`AdminRole with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoAdminRole, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		roleName: string,
		isDefault: boolean,
	): Promise<Domain.Contexts.Role.AdminRole.AdminRole<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Role.AdminRole.AdminRole.getNewInstance(
				adapter,
				this.passport,
				roleName,
				isDefault,
			),
		);
	}
}
