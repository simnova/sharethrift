Feature: Personal User Account Profile Billing Entity

Background:
	Given I have a billing props object

Scenario: Billing subscriptionId can be string or null
	When I access the subscriptionId property
	Then it should be a string or null

Scenario: Billing cybersourceCustomerId can be string or null
	When I access the cybersourceCustomerId property
	Then it should be null or a string

Scenario: Billing paymentState should be a string
	When I access the paymentState property
	Then it should be a string

Scenario: Billing lastTransactionId can be string or null
	When I access the lastTransactionId property
	Then it should be a string or null

Scenario: Billing lastPaymentAmount can be number or null
	When I access the lastPaymentAmount property
	Then it should be a number or null
