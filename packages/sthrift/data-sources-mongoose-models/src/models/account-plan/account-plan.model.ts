import { Schema, type Model, type SchemaDefinition } from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

export interface AccountPlanFeature extends MongooseSeedwork.NestedPath {
	activeReservations: number;
	bookmarks: number;
	itemsToShare: number;
	friends: number;
}
const AccountPlanFeatureType: SchemaDefinition<AccountPlanFeature> = {
	activeReservations: { type: Number, required: true },
	bookmarks: { type: Number, required: true },
	itemsToShare: { type: Number, required: true },
	friends: { type: Number, required: true },
};

export const AccountPlanStatus = {
	DRAFT: 'DRAFT',
	ACTIVE: 'ACTIVE',
	INACTIVE: 'INACTIVE',
};

export interface AccountPlan extends MongooseSeedwork.Base {
	name: string;
	description: string;
	billingPeriodLength: number;
	billingPeriodUnit: string;
	billingCycles: number;
	billingAmount: number;
	currency: string;
	setupFee: number;
	feature: AccountPlanFeature;
	status: string;
	cybersourcePlanId: string;
	schemaVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

const AccountPlanSchema = new Schema<
	AccountPlan,
	Model<AccountPlan>,
	AccountPlan
>(
	{
		name: { type: String, required: true },
		description: { type: String, required: false },
		billingPeriodLength: { type: Number, required: true },
		billingPeriodUnit: { type: String, required: true },
		billingCycles: { type: Number, required: true },
		billingAmount: { type: Number, required: true },
		currency: { type: String, required: true },
		setupFee: { type: Number, required: false },
		feature: {
			type: AccountPlanFeatureType,
			required: true,
			...MongooseSeedwork.NestedPathOptions,
		},
		status: {
			type: String,
			required: false,
			enum: [
				AccountPlanStatus.DRAFT,
				AccountPlanStatus.ACTIVE,
				AccountPlanStatus.INACTIVE,
			],
		},
		cybersourcePlanId: { type: String, required: false },
		schemaVersion: { type: String, required: true, default: '1.0.0' },
		createdAt: { type: Date, required: true, default: Date.now },
		updatedAt: { type: Date, required: true, default: Date.now },
	},
	{ timestamps: true },
);

export const AccountPlanModelName = 'AccountPlan';
export const AccountPlanModelFactory =
	MongooseSeedwork.modelFactory<AccountPlan>(
		AccountPlanModelName,
		AccountPlanSchema,
	);
export type AccountPlanModelType = ReturnType<typeof AccountPlanModelFactory>;
