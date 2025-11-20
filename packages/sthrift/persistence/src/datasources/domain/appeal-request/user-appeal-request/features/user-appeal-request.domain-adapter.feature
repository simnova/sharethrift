Feature: <DomainAdapter> UserAppealRequestDomainAdapter

Background:
Given a UserAppealRequest document from the database
And a UserAppealRequestDomainAdapter wrapping the document

	Scenario: Accessing user appeal request properties
		Then the domain adapter should have a user property
		And the domain adapter should have a blocker property
		And the domain adapter should have a reason property
		And the domain adapter should have a state property
		And the domain adapter should have a type property

	Scenario: Getting user appeal request user reference
		When I access the user property
		Then I should receive a PersonalUser reference with an id

	Scenario: Getting user appeal request blocker reference
		When I access the blocker property
		Then I should receive a PersonalUser reference with an id

	Scenario: Modifying user appeal request reason
		When I set the reason to "Updated reason"
		Then the reason should be "Updated reason"

	Scenario: Modifying user appeal request state
		When I set the state to "accepted"
		Then the state should be "accepted"
