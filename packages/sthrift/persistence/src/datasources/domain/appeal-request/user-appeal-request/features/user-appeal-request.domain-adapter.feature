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

	Scenario: Setting user property with valid reference
		When I set the user property with a valid reference
		Then the document user field should be updated

	Scenario: Setting user property with missing id throws error
		When I set the user property with a reference missing id
		Then it should throw an error about missing user id

	Scenario: Setting blocker property with valid reference
		When I set the blocker property with a valid reference
		Then the document blocker field should be updated

	Scenario: Setting blocker property with missing id throws error
		When I set the blocker property with a reference missing id
		Then it should throw an error about missing blocker id

	Scenario: Loading user when populated as ObjectId
		When the user is an ObjectId and I call loadUser
		Then it should populate the user field
		And return a PersonalUserDomainAdapter

	Scenario: Loading blocker when populated as ObjectId
		When the blocker is an ObjectId and I call loadBlocker
		Then it should populate the blocker field
		And return a PersonalUserDomainAdapter
