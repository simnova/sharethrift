export interface AuthenticatedPrincipal {
	id: string;
	email: string;
	roles: string[];
}

export interface ItemListingDomainPermissions {
	canCreateItemListing: boolean;
	canUpdateItemListing: boolean;
	canDeleteItemListing: boolean;
	canViewItemListing: boolean;
	canPublishItemListing: boolean;
	canPauseItemListing: boolean;
	canReportItemListing: boolean;
}

export class ItemListingPassportBase {
	protected readonly principal: AuthenticatedPrincipal;
	protected readonly permissions: ItemListingDomainPermissions;

	constructor(principal: AuthenticatedPrincipal, permissions: ItemListingDomainPermissions) {
		this.principal = principal;
		this.permissions = permissions;
		
		// Validate required entities
		if (!principal?.id) {
			throw new Error('Principal ID is required for passport');
		}
	}

	public determineIf(predicate: (permissions: ItemListingDomainPermissions) => boolean): boolean {
		return predicate(this.permissions);
	}

	public get principalId(): string {
		return this.principal.id;
	}

	public get principalEmail(): string {
		return this.principal.email;
	}

	public get principalRoles(): string[] {
		return this.principal.roles;
	}
}