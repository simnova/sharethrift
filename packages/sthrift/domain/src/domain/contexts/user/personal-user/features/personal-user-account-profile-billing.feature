Feature: Personal User Account Profile Billing Value Object

Scenario: Billing value object can be created with valid props
	Given I have billing props with all fields
	When I create a PersonalUserAccountProfileBilling instance
	Then it should be created successfully

Scenario: Billing subscriptionId getter returns correct value
	Given I have a billing instance with subscriptionId
	When I access the subscriptionId property
	Then it should return the correct subscriptionId value

Scenario: Billing cybersourceCustomerId getter returns correct value
	Given I have a billing instance with cybersourceCustomerId
	When I access the cybersourceCustomerId property
	Then it should return the correct cybersourceCustomerId value

Scenario: Billing paymentState getter returns correct value
	Given I have a billing instance with paymentState
	When I access the paymentState property
	Then it should return the correct paymentState value

Scenario: Billing lastTransactionId getter returns correct value
	Given I have a billing instance with lastTransactionId
	When I access the lastTransactionId property
	Then it should return the correct lastTransactionId value

Scenario: Billing lastPaymentAmount getter returns correct value
	Given I have a billing instance with lastPaymentAmount
	When I access the lastPaymentAmount property
	Then it should return the correct lastPaymentAmount value

Scenario: Billing subscriptionId setter requires valid visa
	Given I have a billing instance with a restrictive visa
	When I attempt to set subscriptionId without permission
	Then it should throw a PermissionError

Scenario: Billing subscriptionId setter works with valid visa
	Given I have a billing instance with a permissive visa
	When I set the subscriptionId property
	Then the subscriptionId should be updated

Scenario: Billing cybersourceCustomerId setter requires valid visa
	Given I have a billing instance with a restrictive visa
	When I attempt to set cybersourceCustomerId without permission
	Then it should throw a PermissionError

Scenario: Billing allows setters when entity is new
	Given I have a billing instance for a new entity
	When I set the subscriptionId property
	Then the subscriptionId should be updated without visa check
