Feature: Guest Passport Base

Scenario: GuestPassportBase should be an abstract class
	Given I have the GuestPassportBase class
	When I check the class type
	Then it should be defined

Scenario: GuestPassportBase should be extendable
	Given I create a class extending GuestPassportBase
	When I instantiate the extended class
	Then it should be an instance of GuestPassportBase
