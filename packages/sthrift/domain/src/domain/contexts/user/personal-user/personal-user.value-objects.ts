import {
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

// Re-export shared value objects
export class Username extends UsernameBase {}
export class FirstName extends FirstNameBase {}
export class LastName extends LastNameBase {}
export class Address extends AddressBase {}
export class City extends CityBase {}
export class State extends StateBase {}
export class Country extends CountryBase {}
export class ZipCode extends ZipCodeBase {}
