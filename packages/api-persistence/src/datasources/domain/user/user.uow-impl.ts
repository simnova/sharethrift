import { Model } from 'mongoose';
import { Domain } from '@ocom/api-domain';
import type { UserModel } from '@ocom/api-data-sources-mongoose-models';
import { UserRepositoryImpl } from './user.repository-impl.ts';

/**
 * Mongoose implementation of UserUnitOfWork
 */
export class UserUnitOfWorkImpl<props extends Domain.Contexts.User.UserProps>
	implements Domain.Contexts.User.UserUnitOfWork<props> {
	
	public readonly userRepository: Domain.Contexts.User.UserRepository<props>;

	constructor(
		userModel: Model<UserModel>,
		passport: Domain.Contexts.User.UserPassport
	) {
		this.userRepository = new UserRepositoryImpl<props>(userModel, passport);
	}

	async withTransaction<TReturn>(
		_passport: Domain.Contexts.User.UserPassport,
		func: (repository: Domain.Contexts.User.UserRepository<props>) => Promise<TReturn>
	): Promise<TReturn> {
		// For now, implement without actual transaction support
		// This can be enhanced later with mongoose transactions
		return await func(this.userRepository);
	}
}