Feature: Admin Role Value Objects

Scenario: Creating a RoleName with valid input
	When I create a RoleName with "Administrator"
	Then the value should be "Administrator"

Scenario: Creating a RoleName with null
	When I try to create a RoleName with null
	Then an error should be thrown indicating the value is invalid

Scenario: Creating a RoleName with empty string
	When I try to create a RoleName with an empty string
	Then an error should be thrown indicating the value is invalid

Scenario: Creating a RoleName with a string exceeding max length
	When I try to create a RoleName with a string longer than 50 characters
	Then an error should be thrown indicating the value is too long
