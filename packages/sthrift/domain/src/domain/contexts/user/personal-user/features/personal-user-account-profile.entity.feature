Feature: Personal User Account Profile Entity

Background:
	Given I have a personal user profile props object

Scenario: Personal user profile firstName should be a string
	When I access the firstName property
	Then it should be a string

Scenario: Personal user profile lastName should be a string
	When I access the lastName property
	Then it should be a string

Scenario: Personal user profile aboutMe should be a string
	When I access the aboutMe property
	Then it should be a string

Scenario: Personal user profile location should be readonly
	When I access the location property
	Then it should be an object

Scenario: Personal user profile billing should be readonly
	When I access the billing property
	Then it should be an object
