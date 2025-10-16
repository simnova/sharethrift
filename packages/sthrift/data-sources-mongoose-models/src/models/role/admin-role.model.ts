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
}

export interface AdminRoleContentPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canViewReports: boolean;
	canModerateListings: boolean;
	canModerateConversations: boolean;
	canModerateReservations: boolean;
	canDeleteContent: boolean;
}

export interface AdminRoleSystemPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canAccessAnalytics: boolean;
	canManageRoles: boolean;
	canViewSystemLogs: boolean;
	canManageSystemSettings: boolean;
	canAccessDatabaseTools: boolean;
}

export interface AdminRolePermissions extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	userPermissions: AdminRoleUserPermissions;
	contentPermissions: AdminRoleContentPermissions;
	systemPermissions: AdminRoleSystemPermissions;
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
			} as SchemaDefinition<AdminRoleUserPermissions>,
			contentPermissions: {
				canViewReports: { type: Boolean, required: true, default: false },
				canModerateListings: { type: Boolean, required: true, default: false },
				canModerateConversations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canModerateReservations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canDeleteContent: { type: Boolean, required: true, default: false },
			} as SchemaDefinition<AdminRoleContentPermissions>,
			systemPermissions: {
				canAccessAnalytics: { type: Boolean, required: true, default: false },
				canManageRoles: { type: Boolean, required: true, default: false },
				canViewSystemLogs: { type: Boolean, required: true, default: false },
				canManageSystemSettings: {
					type: Boolean,
					required: true,
					default: false,
				},
				canAccessDatabaseTools: {
					type: Boolean,
					required: true,
					default: false,
				},
			} as SchemaDefinition<AdminRoleSystemPermissions>,
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
