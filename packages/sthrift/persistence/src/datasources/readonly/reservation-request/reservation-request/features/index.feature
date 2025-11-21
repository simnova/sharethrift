Feature: <Index> Reservation Request Readonly Index Exports

	Scenario: Exports from reservation request readonly index
		Then the getReservationRequestReadRepository function should be exported
		And getReservationRequestReadRepository should be a function
