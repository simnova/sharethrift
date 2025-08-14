import { Model } from 'mongoose';
import { Domain } from '@ocom/api-domain';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserModel } from '@ocom/api-data-sources-mongoose-models';
import { toUserModel, toDomainProps } from './user.converter.ts';

/**
 * Mongoose implementation of UserRepository
 */
export class UserRepositoryImpl<props extends Domain.Contexts.User.UserProps>
	implements Domain.Contexts.User.UserRepository<props> {
	
	constructor(
		private readonly userModel: Model<UserModel>,
		private readonly passport: Domain.Contexts.User.UserPassport
	) {}

	getNewInstance(props: props): Promise<Domain.Contexts.User.User<props>> {
		return Promise.resolve(Domain.Contexts.User.User.getNewInstance(props, this.passport));
	}

	async get(id: string): Promise<Domain.Contexts.User.User<props>> {
		const user = await this.getById(id);
		if (!user) {
			throw new DomainSeedwork.NotFoundError(`User with id ${id} not found`);
		}
		return user;
	}

	async getById(id: string): Promise<Domain.Contexts.User.User<props> | null> {
		const doc = await this.userModel.findById(id).lean();
		if (!doc) {
			return null;
		}
		const domainProps = toDomainProps(doc as UserModel) as props;
		return new Domain.Contexts.User.User(domainProps, this.passport);
	}

	async getByEmail(email: string): Promise<Domain.Contexts.User.User<props> | null> {
		const doc = await this.userModel.findOne({ 'account.email': email }).lean();
		if (!doc) {
			return null;
		}
		const domainProps = toDomainProps(doc as UserModel) as props;
		return new Domain.Contexts.User.User(domainProps, this.passport);
	}

	async getByUsername(username: string): Promise<Domain.Contexts.User.User<props> | null> {
		const doc = await this.userModel.findOne({ 'account.username': username }).lean();
		if (!doc) {
			return null;
		}
		const domainProps = toDomainProps(doc as UserModel) as props;
		return new Domain.Contexts.User.User(domainProps, this.passport);
	}

	async getAll(limit: number = 50, offset: number = 0): Promise<Domain.Contexts.User.User<props>[]> {
		const docs = await this.userModel
			.find()
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.lean();
		
		return docs.map(doc => {
			const domainProps = toDomainProps(doc as UserModel) as props;
			return new Domain.Contexts.User.User(domainProps, this.passport);
		});
	}

	async getByUserType(userType: string, limit: number = 50, offset: number = 0): Promise<Domain.Contexts.User.User<props>[]> {
		const docs = await this.userModel
			.find({ userType })
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.lean();
		
		return docs.map(doc => {
			const domainProps = toDomainProps(doc as UserModel) as props;
			return new Domain.Contexts.User.User(domainProps, this.passport);
		});
	}

	async emailExists(email: string): Promise<boolean> {
		const count = await this.userModel.countDocuments({ 'account.email': email });
		return count > 0;
	}

	async usernameExists(username: string): Promise<boolean> {
		const count = await this.userModel.countDocuments({ 'account.username': username });
		return count > 0;
	}

	async save(user: Domain.Contexts.User.User<props>): Promise<Domain.Contexts.User.User<props>> {
		const isNew = !user.id;
		
		if (isNew) {
			// Create new user
			const modelData = toUserModel(user as unknown as Domain.Contexts.User.UserProps);
			const doc = new this.userModel(modelData);
			const savedDoc = await doc.save();
			
			// Update domain object with new ID and timestamps
			const updatedProps = toDomainProps(savedDoc as UserModel) as props;
			return new Domain.Contexts.User.User(updatedProps, this.passport);
		} else {
			// Update existing user
			const modelData = toUserModel(user as unknown as Domain.Contexts.User.UserProps);
			const updatedDoc = await this.userModel.findByIdAndUpdate(
				user.id,
				modelData,
				{ new: true, runValidators: true }
			).lean();
			
			if (!updatedDoc) {
				throw new DomainSeedwork.NotFoundError('User not found');
			}
			
			const updatedProps = toDomainProps(updatedDoc as UserModel) as props;
			return new Domain.Contexts.User.User(updatedProps, this.passport);
		}
	}

	async delete(id: string): Promise<void> {
		const result = await this.userModel.findByIdAndDelete(id);
		if (!result) {
			throw new DomainSeedwork.NotFoundError('User not found');
		}
	}
}