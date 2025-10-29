import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	type Model,
	type ObjectId,
	Schema,
	type SchemaDefinition,
} from 'mongoose';
import { type Role, type RoleModelType, roleOptions } from './role.model.ts';

export interface AdminRoleUserPermissions extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canBlockUsers: boolean;
	canViewAllUsers: boolean;
	canEditUsers: boolean;
	canDeleteUsers: boolean;
	canManageUserRoles: boolean;
	canAccessAnalytics: boolean;
	canManageRoles: boolean;
	canViewReports: boolean;
	canDeleteContent: boolean;
}

export interface AdminRoleConversationPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canModerateConversations: boolean;
}

export interface AdminRoleListingPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canModerateListings: boolean;
}

export interface AdminRoleReservationRequestPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canModerateReservations: boolean;
}

export interface AdminRolePermissions extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	userPermissions: AdminRoleUserPermissions;
	conversationPermissions: AdminRoleConversationPermissions;
	listingPermissions: AdminRoleListingPermissions;
	reservationRequestPermissions: AdminRoleReservationRequestPermissions;
}

export interface AdminRole extends Role {
	permissions: AdminRolePermissions;
	roleName: string;
	roleType: string;
	isDefault: boolean;
}

export const AdminRoleSchema = new Schema<
	AdminRole,
	Model<AdminRole>,
	AdminRole
>(
	{
		permissions: {
			userPermissions: {
				canBlockUsers: { type: Boolean, required: true, default: false },
				canViewAllUsers: { type: Boolean, required: true, default: false },
				canEditUsers: { type: Boolean, required: true, default: false },
				canDeleteUsers: { type: Boolean, required: true, default: false },
				canManageUserRoles: { type: Boolean, required: true, default: false },
				canAccessAnalytics: { type: Boolean, required: true, default: false },
				canManageRoles: { type: Boolean, required: true, default: false },
				canViewReports: { type: Boolean, required: true, default: false },
				canDeleteContent: { type: Boolean, required: true, default: false },
			} as SchemaDefinition<AdminRoleUserPermissions>,
			conversationPermissions: {
				canModerateConversations: {
					type: Boolean,
					required: true,
					default: false,
				},
			} as SchemaDefinition<AdminRoleConversationPermissions>,
			listingPermissions: {
				canModerateListings: { type: Boolean, required: true, default: false },
			} as SchemaDefinition<AdminRoleListingPermissions>,
			reservationRequestPermissions: {
				canModerateReservations: {
					type: Boolean,
					required: true,
					default: false,
				},
			} as SchemaDefinition<AdminRoleReservationRequestPermissions>,
		} as SchemaDefinition<AdminRolePermissions>,
		schemaVersion: { type: String, default: '1.0.0' },
		roleName: { type: String, required: true, maxlength: 50 },
		isDefault: { type: Boolean, required: true, default: false },
	},
	roleOptions,
).index({ roleName: 1 }, { unique: true });

export const AdminRoleModelName: string = 'admin-role';

export const AdminRoleModelFactory = (RoleModel: RoleModelType) => {
	return RoleModel.discriminator(AdminRoleModelName, AdminRoleSchema);
};

export type AdminRoleModelType = ReturnType<typeof AdminRoleModelFactory>;
