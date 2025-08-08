export interface ReservationRequestVisa {
	determineIf(predicate: (permissions: Record<string, unknown>) => boolean): boolean;
}