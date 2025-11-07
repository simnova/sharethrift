/**
 * State mappings between database values and domain values
 * Database uses UI-friendly names, domain uses business logic names
 */

// Database -> Domain mapping
export const DB_TO_DOMAIN_STATE: Record<string, string> = {
	Pending: 'Requested',
	Approved: 'Accepted',
	Requested: 'Requested', // Support both formats
	Accepted: 'Accepted',
	Rejected: 'Rejected',
	Cancelled: 'Cancelled',
	Closed: 'Closed',
};

// Domain -> Database mapping
export const DOMAIN_TO_DB_STATE: Record<string, string> = {
	Requested: 'Pending',
	Accepted: 'Approved',
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
