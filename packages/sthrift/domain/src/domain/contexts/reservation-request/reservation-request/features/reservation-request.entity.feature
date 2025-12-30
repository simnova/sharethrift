Feature: Reservation Request Entity

Background:
	Given I have a reservation request props object

Scenario: Reservation request state should be a string
	When I access the state property
	Then it should be a string

Scenario: Reservation request period dates should be Date objects
	When I access the period date properties
	Then reservationPeriodStart and reservationPeriodEnd should be Date objects

Scenario: Reservation request createdAt should be readonly
	When I access the createdAt property
	Then it should be a Date object

Scenario: Reservation request updatedAt should be readonly
	When I access the updatedAt property
	Then it should be a Date object

Scenario: Reservation request schemaVersion should be readonly
	When I access the schemaVersion property
	Then it should be a string

Scenario: Reservation request listing reference should be readonly
	When I attempt to modify the listing property
	Then the listing property should be readonly

Scenario: Reservation request loadListing should return a promise
	When I call the loadListing method
	Then it should return a listing reference

Scenario: Reservation request reserver reference should be readonly
	When I attempt to modify the reserver property
	Then the reserver property should be readonly

Scenario: Reservation request loadReserver should return a promise
	When I call the loadReserver method
	Then it should return a reserver reference

Scenario: Reservation request closeRequestedBy should be nullable
	When I access the close request field
	Then it should be null by default
