export interface ItemListingVisa {
	determineIf(predicate: (permissions: Record<string, unknown>) => boolean): boolean;
	canCreate(): boolean;
	canUpdate(): boolean;
	canDelete(): boolean;
	canView(): boolean;
	canPublish(): boolean;
	canPause(): boolean;
	canReport(): boolean;
}