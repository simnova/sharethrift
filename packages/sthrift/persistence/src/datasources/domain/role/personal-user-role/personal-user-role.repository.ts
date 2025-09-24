import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import type { PersonalUserRoleDomainAdapter } from './personal-user-role.domain-adapter.ts';

type PersonalUserRoleModelType = Models.Role.PersonalUserRole; // ReturnType<typeof Models.EndUserRole.EndUserRoleModelFactory> & Models.EndUserRole.EndUserRole & { baseModelName: string };
type PropType = PersonalUserRoleDomainAdapter;

export class PersonalUserRoleRepository //<
	extends MongooseSeedwork.MongoRepositoryBase<
		PersonalUserRoleModelType,
		PropType,
		Domain.Passport,
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRole<PropType>
	>
	implements
		Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleRepository<PropType>
{
	async getById(
		id: string,
	): Promise<Domain.Contexts.Role.PersonalUserRole.PersonalUserRole<PropType>> {
		const mongoPersonalUserRole = await this.model.findById(id).exec();
		if (!mongoPersonalUserRole) {
			throw new Error(`EndUserRole with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoPersonalUserRole, this.passport);
	}
	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		roleName: string,
		isDefault: boolean,
	): Promise<Domain.Contexts.Role.PersonalUserRole.PersonalUserRole<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Role.PersonalUserRole.PersonalUserRole.getNewInstance(
				adapter,
				this.passport,
				roleName,
				isDefault,
			),
		);
	}
}
