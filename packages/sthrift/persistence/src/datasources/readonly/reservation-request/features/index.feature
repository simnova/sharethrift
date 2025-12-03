Feature: <Index> Readonly Reservation Request Context Index Exports

	Scenario: Exports from readonly reservation request context index
		Then the ReservationRequestContext function should be exported
		And ReservationRequestContext should be a function

	Scenario: Creating Reservation Request Read Context
		Given a mock ModelsContext with ReservationRequest models
		And a mock Passport
		When I call ReservationRequestContext with models and passport
		Then it should return an object with ReservationRequest property
