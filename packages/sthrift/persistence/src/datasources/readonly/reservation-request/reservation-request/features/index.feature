Feature: ReservationRequestReadRepositoryImpl Reservation Request Read Repository Implementation

	Background:
		Given a valid models context with ReservationRequest model
		And a valid passport for domain operations

	Scenario: Creating Reservation Request Read Repository Implementation
		When I call ReservationRequestReadRepositoryImpl with models and passport
		Then I should receive an object with ReservationRequestReadRepo property
		And the ReservationRequestReadRepo should be a ReservationRequestReadRepository instance

	Scenario: ReservationRequestReadRepositoryImpl exports
		Then ReservationRequestReadRepositoryImpl should be exported from index
		And ReservationRequestReadRepositoryImpl should be a function
		And ReservationRequestReadRepository type should be exported from index
