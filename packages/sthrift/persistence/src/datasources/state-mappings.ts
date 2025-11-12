/**
 * State mappings between database values and domain values
 * All layers now use consistent terminology: Requested and Accepted
 */

// Database -> Domain mapping (now 1:1)
export const DB_TO_DOMAIN_STATE: Record<string, string> = {
	Requested: 'Requested',
	Accepted: 'Accepted',
	Rejected: 'Rejected',
	Cancelled: 'Cancelled',
	Closed: 'Closed',
	// Backward compatibility with old database values
	Pending: 'Requested',
	Approved: 'Accepted',
};

// Domain -> Database mapping (now 1:1)
export const DOMAIN_TO_DB_STATE: Record<string, string> = {
	Requested: 'Requested',
	Accepted: 'Accepted',
	Rejected: 'Rejected',
	Cancelled: 'Cancelled',
	Closed: 'Closed',
};

/**
 * Convert domain state to database state
 */
export function domainToDbState(domainState: string): string {
	return DOMAIN_TO_DB_STATE[domainState] || domainState;
}

/**
 * Convert database state to domain state
 */
export function dbToDomainState(dbState: string): string {
	return DB_TO_DOMAIN_STATE[dbState] || dbState;
}

/**
 * Convert array of domain states to database states (for queries)
 */
export function domainToDbStates(domainStates: string[]): string[] {
	return domainStates.map(domainToDbState);
}
