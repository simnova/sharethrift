export interface ReservationRequestVisa {
	determineIf(predicate: (permissions: Record<string, unknown>) => boolean): boolean;
	canCreate(): boolean;
	canUpdate(): boolean;
	canDelete(): boolean;
	canAccept(): boolean;
	canReject(): boolean;
	canCancel(): boolean;
	canClose(): boolean;
	canView(): boolean;
}