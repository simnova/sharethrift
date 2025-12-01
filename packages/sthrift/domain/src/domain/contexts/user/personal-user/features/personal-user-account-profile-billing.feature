Feature: Personal User Account Profile Billing Value Object

Scenario: Billing value object can be created with valid props
	Given I have billing props with all fields
	When I create a PersonalUserAccountProfileBilling instance
	Then it should be created successfully

Scenario: Billing subscription getter returns correct subscription object
	Given I have a billing instance with subscription data
	When I access the subscription property
	Then it should return a PersonalUserAccountProfileBillingSubscription instance

Scenario: Billing cybersourceCustomerId getter returns correct value
	Given I have a billing instance with cybersourceCustomerId
	When I access the cybersourceCustomerId property
	Then it should return the correct cybersourceCustomerId value

Scenario: Billing transactions getter returns correct transactions array
	Given I have a billing instance with transactions data
	When I access the transactions property
	Then it should return an array of PersonalUserAccountProfileBillingTransactions instances

Scenario: Billing cybersourceCustomerId setter requires valid visa
	Given I have a billing instance with a restrictive visa
	When I attempt to set cybersourceCustomerId without permission
	Then it should throw a PermissionError

Scenario: Billing cybersourceCustomerId setter works with valid visa
	Given I have a billing instance with a permissive visa
	When I set the cybersourceCustomerId property
	Then the cybersourceCustomerId should be updated

Scenario: Billing allows setters when entity is new
	Given I have a billing instance for a new entity
	When I set the cybersourceCustomerId property
	Then the cybersourceCustomerId should be updated without visa check
