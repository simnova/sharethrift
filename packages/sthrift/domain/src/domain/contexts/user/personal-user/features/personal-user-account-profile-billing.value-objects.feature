Feature: PaymentState Value Object

Scenario: PaymentState Pending constant is valid
	When I access PaymentState.Pending
	Then it should be a PaymentState instance with value PENDING

Scenario: PaymentState Succeeded constant is valid
	When I access PaymentState.Succeeded
	Then it should be a PaymentState instance with value SUCCEEDED

Scenario: PaymentState Failed constant is valid
	When I access PaymentState.Failed
	Then it should be a PaymentState instance with value FAILED

Scenario: PaymentState Refunded constant is valid
	When I access PaymentState.Refunded
	Then it should be a PaymentState instance with value REFUNDED

Scenario: PaymentState can be created with valid value
	Given I have a valid payment state string
	When I create a PaymentState instance
	Then it should be created successfully

Scenario: PaymentState rejects invalid length string
	Given I have a string with invalid length
	When I attempt to create a PaymentState instance
	Then it should throw a validation error
