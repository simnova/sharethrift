import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { User, UserProps } from './user.aggregate.ts';
import type { UserRepository } from './user.repository.ts';
import type { UserPassport } from '../user.passport.ts';

/**
 * Unit of Work interface for User aggregate transactional operations.
 * Ensures consistency across multiple user operations within a transaction.
 */
export interface UserUnitOfWork<props extends UserProps> 
	extends DomainSeedwork.UnitOfWork<UserPassport, props, User<props>, UserRepository<props>> {
	
	/**
	 * Gets the user repository for this unit of work
	 * @returns UserRepository instance
	 */
	userRepository: UserRepository<props>;
}