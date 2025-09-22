import { type Model, Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

export interface User extends MongooseSeedwork.Base {
	discriminatorKey: string;
}

export const userOptions = {
	discriminatorKey: 'userType',
	timestamps: true,
};

const UserSchema = new Schema<User, Model<User>, User>({}, userOptions);
export const UserModelName = 'User';

export const UserModelFactory = MongooseSeedwork.modelFactory<User>(
	UserModelName,
	UserSchema,
);
export type UserModelType = ReturnType<typeof UserModelFactory>;
