Feature: PersonalUser Reservation Request Visa
	Scenario: Reservation visa evaluates sharer permissions
		Given I have a reservation visa as sharer
		When I check accept permission
		Then sharer can accept request

	Scenario: Reservation visa is created properly
		Given I create a reservation request visa
		When I check the visa
		Then it should have determineIf function

	Scenario: Reservation visa evaluates reserver close permission
		Given I have a reservation visa as reserver
		When I check close permission as reserver
		Then reserver can close request
