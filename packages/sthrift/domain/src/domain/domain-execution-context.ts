import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from './contexts/passport.js';

export interface DomainExecutionContext
	extends DomainSeedwork.BaseDomainExecutionContext {
	passport: Passport;
}
