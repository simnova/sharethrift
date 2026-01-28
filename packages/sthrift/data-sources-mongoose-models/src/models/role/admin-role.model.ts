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
	canViewAllConversations: boolean;
	canEditConversations: boolean;
	canDeleteConversations: boolean;
	canCloseConversations: boolean;
	canModerateConversations: boolean;
}

export interface AdminRoleListingPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canViewAllListings: boolean;
	canManageAllListings: boolean;
	canEditListings: boolean;
	canDeleteListings: boolean;
	canApproveListings: boolean;
	canRejectListings: boolean;
	canBlockListings: boolean;
	canUnblockListings: boolean;
	canModerateListings: boolean;
}

export interface AdminRoleReservationRequestPermissions
	extends MongooseSeedwork.NestedPath {
	id?: ObjectId;
	canViewAllReservations: boolean;
	canApproveReservations: boolean;
	canRejectReservations: boolean;
	canCancelReservations: boolean;
	canEditReservations: boolean;
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
				canManageStaffRolesAndPermissions: { type: Boolean, required: true, default: false },
				canAccessAnalytics: { type: Boolean, required: true, default: false },
				canManageRoles: { type: Boolean, required: true, default: false },
				canViewReports: { type: Boolean, required: true, default: false },
				canDeleteContent: { type: Boolean, required: true, default: false },
			} as SchemaDefinition<AdminRoleUserPermissions>,
			conversationPermissions: {
				canViewAllConversations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canEditConversations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canDeleteConversations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canCloseConversations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canModerateConversations: {
					type: Boolean,
					required: true,
					default: false,
				},
			} as SchemaDefinition<AdminRoleConversationPermissions>,
			listingPermissions: {
				canViewAllListings: { type: Boolean, required: true, default: false },
				canManageAllListings: { type: Boolean, required: true, default: false },
				canEditListings: { type: Boolean, required: true, default: false },
				canDeleteListings: { type: Boolean, required: true, default: false },
				canApproveListings: { type: Boolean, required: true, default: false },
				canRejectListings: { type: Boolean, required: true, default: false },
				canBlockListings: { type: Boolean, required: true, default: false },
				canUnblockListings: { type: Boolean, required: true, default: false },
				canModerateListings: { type: Boolean, required: true, default: false },
			} as SchemaDefinition<AdminRoleListingPermissions>,
			reservationRequestPermissions: {
				canViewAllReservations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canApproveReservations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canRejectReservations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canCancelReservations: {
					type: Boolean,
					required: true,
					default: false,
				},
				canEditReservations: {
					type: Boolean,
					required: true,
					default: false,
				},
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
