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

	Scenario: Getting and setting closeRequestedBySharer
		When I get the closeRequestedBySharer property
		Then it should return a boolean value
		When I set closeRequestedBySharer to true
		Then closeRequestedBySharer should be true

	Scenario: Getting and setting closeRequestedByReserver
		When I get the closeRequestedByReserver property
		Then it should return a boolean value
		When I set closeRequestedByReserver to true
		Then closeRequestedByReserver should be true

	Scenario: Setting reservationPeriodStart
		Given a new start date
		When I set reservationPeriodStart to the new date
		Then reservationPeriodStart should match the new date

	Scenario: Setting reservationPeriodEnd
		Given a new end date
		When I set reservationPeriodEnd to the new date
		Then reservationPeriodEnd should match the new date

	Scenario: Setting listing reference
		Given a valid listing reference with id
		When I set the listing property
		Then the document should be updated with the listing id

	Scenario: Setting reserver reference
		Given a valid user reference with id
		When I set the reserver property
		Then the document should be updated with the reserver id

	Scenario: Setting listing property with missing id throws error
		When I set the listing property to a reference missing id
		Then an error should be thrown indicating listing reference is missing id

	Scenario: Setting reserver property with missing id throws error
		When I set the reserver property to a reference missing id
		Then an error should be thrown indicating user reference is missing id

	Scenario: Loading listing when it is an ObjectId
		When I call loadListing on an adapter with listing as ObjectId
		Then it should populate and return an ItemListingDomainAdapter

	Scenario: Loading reserver when it is an ObjectId
		When I call loadReserver on an adapter with reserver as ObjectId
		Then it should populate and return a PersonalUserDomainAdapter
