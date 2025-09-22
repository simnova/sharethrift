import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	type Model,
	type ObjectId,
	Schema,
	type SchemaDefinition,
} from 'mongoose';
import { type Role, type RoleModelType, roleOptions } from './role.model.ts';

export interface PersonalUserRoleListingPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canCreateItemListing: boolean;
	canUpdateItemListing: boolean;
	canDeleteItemListing: boolean;
	canViewItemListing: boolean;
	canPublishItemListing: boolean;
	canUnpublishItemListing: boolean;
}

export interface PersonalUserRoleConversationPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canCreateConversation: boolean;
	canManageConversation: boolean;
	canViewConversation: boolean;
}

export interface PersonalUserRoleReservationRequestPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canCreateReservationRequest: boolean;
	canManageReservationRequest: boolean;
	canViewReservationRequest: boolean;
}

export interface PersonalUserRolePermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	listingPermissions: PersonalUserRoleListingPermissions;
	conversationPermissions: PersonalUserRoleConversationPermissions;
	reservationRequestPermissions: PersonalUserRoleReservationRequestPermissions;
}

export interface PersonalUserRole extends Role {
	permissions: PersonalUserRolePermissions;
	roleName: string;
	roleType: string;
	isDefault: boolean;
}

export const PersonalUserRoleSchema = new Schema<
	PersonalUserRole,
	Model<PersonalUserRole>,
	PersonalUserRole
>(
	{
		permissions: {
			listing: {
				canCreateItemListing: { type: Boolean, required: true, default: false },
				canUpdateItemListing: { type: Boolean, required: true, default: false },
				canDeleteItemListing: { type: Boolean, required: true, default: false },
				canViewItemListing: { type: Boolean, required: true, default: true },
				canPublishItemListing: {
					type: Boolean,
					required: true,
					default: false,
				},
				canUnpublishItemListing: {
					type: Boolean,
					required: true,
					default: false,
				},
			} as SchemaDefinition<PersonalUserRoleListingPermissions>,
			conversation: {
				canCreateConversation: {
					type: Boolean,
					required: true,
					default: false,
				},
				canManageConversation: {
					type: Boolean,
					required: true,
					default: false,
				},
				canViewConversation: { type: Boolean, required: true, default: true },
			} as SchemaDefinition<PersonalUserRoleConversationPermissions>,
			reservationRequest: {
				canCreateReservationRequest: {
					type: Boolean,
					required: true,
					default: false,
				},
				canManageReservationRequest: {
					type: Boolean,
					required: true,
					default: false,
				},
				canViewReservationRequest: {
					type: Boolean,
					required: true,
					default: true,
				},
			} as SchemaDefinition<PersonalUserRoleReservationRequestPermissions>,
		} as SchemaDefinition<PersonalUserRolePermissions>,
		schemaVersion: { type: String, default: '1.0.0' },
		roleName: { type: String, required: true, maxlength: 50 },
		isDefault: { type: Boolean, required: true, default: false },
	},
	roleOptions,
).index({ roleName: 1 }, { unique: true });

export const PersonalUserRoleModelName: string = 'personal-user-role';

export const PersonalUserRoleModelFactory = (RoleModel: RoleModelType) => {
	return RoleModel.discriminator(
		PersonalUserRoleModelName,
		PersonalUserRoleSchema,
	);
};

export type PersonalUserRoleModelType = ReturnType<
	typeof PersonalUserRoleModelFactory
>;
