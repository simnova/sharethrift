Feature: AdminUser Reservation Request Passport
	Scenario: Admin user can access reservation requests
		Given I have an admin user reservation request passport
		When I request access to a reservation request
		Then visa should be created with permission function

	Scenario: Admin user reservation passport is defined
		Given I create an admin user reservation request passport
		When I check the passport
		Then it should be defined
