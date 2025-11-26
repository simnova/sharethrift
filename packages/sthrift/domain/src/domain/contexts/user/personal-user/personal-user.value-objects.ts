import { VOOptional } from '@lucaspaganini/value-objects';
import {
	Email as EmailBase,
	Username as UsernameBase,
	FirstName as FirstNameBase,
	LastName as LastNameBase,
	Address as AddressBase,
	City as CityBase,
	State as StateBase,
	Country as CountryBase,
	ZipCode as ZipCodeBase,
} from '../../value-objects.js';

/**
 * Value objects for User aggregate validation and data integrity.
 */

/**
 * User type enumeration
 */
export const UserType = {
	PERSONAL: 'personal',
	ADMIN: 'admin',
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

/**
 * Account type enumeration
 */
export const AccountType = {
	PERSONAL: 'personal',
	BUSINESS: 'business',
	ENTERPRISE: 'enterprise',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

// Re-export shared value objects
export class Email extends VOOptional(EmailBase, [undefined]) {}
export class Username extends UsernameBase {}
export class FirstName extends FirstNameBase {}
export class LastName extends LastNameBase {}
export class Address extends AddressBase {}
export class City extends CityBase {}
export class State extends StateBase {}
export class Country extends CountryBase {}
export class ZipCode extends ZipCodeBase {}
