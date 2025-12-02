Feature: ReservationRequestPersistence Reservation Request Domain Persistence

	Background:
		Given a valid models context with ReservationRequest model
		And a valid passport for domain operations

	Scenario: Creating Reservation Request Persistence
		When I call ReservationRequestPersistence with models and passport
		Then I should receive an object with ReservationRequestUnitOfWork property
		And the ReservationRequestUnitOfWork should be properly initialized

	Scenario: ReservationRequestPersistence exports
		Then ReservationRequestPersistence should be exported from index
		And ReservationRequestPersistence should be a function
