import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { User, UserProps } from './user.aggregate.ts';

/**
 * Repository interface for User aggregate persistence operations.
 * Provides methods for creating, retrieving, and managing user data.
 */
export interface UserRepository<props extends UserProps>
	extends DomainSeedwork.Repository<User<props>> {
	
	/**
	 * Creates a new user instance with initialized properties
	 * @param props User properties for creation
	 * @returns Promise resolving to new User instance
	 */
	getNewInstance(props: props): Promise<User<props>>;
	
	/**
	 * Retrieves a user by their unique ID
	 * @param id User ID
	 * @returns Promise resolving to User instance or null if not found
	 */
	getById(id: string): Promise<User<props> | null>;
	
	/**
	 * Retrieves a user by their email address
	 * @param email User email address
	 * @returns Promise resolving to User instance or null if not found
	 */
	getByEmail(email: string): Promise<User<props> | null>;
	
	/**
	 * Retrieves a user by their username
	 * @param username User username
	 * @returns Promise resolving to User instance or null if not found
	 */
	getByUsername(username: string): Promise<User<props> | null>;
	
	/**
	 * Retrieves all users with pagination support
	 * @param limit Maximum number of users to return
	 * @param offset Number of users to skip
	 * @returns Promise resolving to array of User instances
	 */
	getAll(limit?: number, offset?: number): Promise<User<props>[]>;
	
	/**
	 * Retrieves users by type (personal, admin)
	 * @param userType Type of users to retrieve
	 * @param limit Maximum number of users to return
	 * @param offset Number of users to skip
	 * @returns Promise resolving to array of User instances
	 */
	getByUserType(userType: string, limit?: number, offset?: number): Promise<User<props>[]>;
	
	/**
	 * Checks if an email address is already in use
	 * @param email Email address to check
	 * @returns Promise resolving to true if email exists
	 */
	emailExists(email: string): Promise<boolean>;
	
	/**
	 * Checks if a username is already in use
	 * @param username Username to check
	 * @returns Promise resolving to true if username exists
	 */
	usernameExists(username: string): Promise<boolean>;
	
	/**
	 * Saves a user instance to the repository
	 * @param user User instance to save
	 * @returns Promise resolving to saved User instance
	 */
	save(user: User<props>): Promise<User<props>>;
	
	/**
	 * Deletes a user from the repository
	 * @param id User ID to delete
	 * @returns Promise resolving when deletion is complete
	 */
	delete(id: string): Promise<void>;
}