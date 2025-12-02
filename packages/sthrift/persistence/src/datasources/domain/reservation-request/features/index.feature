Feature: <Index> Reservation Request Context Index Exports

	Scenario: Exports from reservation request context index
		Then the ReservationRequestContextPersistence function should be exported
		And ReservationRequestContextPersistence should be a function

	Scenario: Creating Reservation Request Context Persistence
		Given a mock ModelsContext with ReservationRequest models
		And a mock Passport
		When I call ReservationRequestContextPersistence with models and passport
		Then it should return an object with ReservationRequest property
