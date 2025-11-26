Feature: Guest Listing Passport

Scenario: Guest passport for listing should deny access
	Given I have a guest listing passport
	When I request access to a listing
	Then access should be denied

Scenario: Guest listing passport should extend GuestPassportBase
	Given I create a guest listing passport
	When I check its prototype chain
	Then it should be an instance of the passport
