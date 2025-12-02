Feature: Personal User Account Entity

Background:
	Given I have a personal user account props object

Scenario: Personal user account type should be a string
	When I access the accountType property
	Then it should be a string

Scenario: Personal user account email should be a string
	When I access the email property
	Then it should be a string

Scenario: Personal user account username should be a string
	When I access the username property
	Then it should be a string

Scenario: Personal user account profile should be readonly
	When I access the profile property
	Then it should be an object
