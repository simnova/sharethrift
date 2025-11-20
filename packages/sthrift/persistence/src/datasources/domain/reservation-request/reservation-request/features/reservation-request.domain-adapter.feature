Feature: <DomainAdapter> ReservationRequestDomainAdapter

Background:
Given a ReservationRequest document from the database
And a ReservationRequestDomainAdapter wrapping the document

	Scenario: Accessing reservation request properties
		Then the domain adapter should have a state property
		And the domain adapter should have a listing property
		And the domain adapter should have a reserver property
		And the domain adapter should have a reservationPeriodStart property
		And the domain adapter should have a reservationPeriodEnd property

	Scenario: Getting reservation request listing reference
		When I access the listing property
		Then I should receive a Listing reference with an id

	Scenario: Getting reservation request reserver reference
		When I access the reserver property
		Then I should receive a User reference with an id

	Scenario: Modifying reservation request state
		When I set the state to "ACCEPTED"
		Then the state should be "ACCEPTED"
