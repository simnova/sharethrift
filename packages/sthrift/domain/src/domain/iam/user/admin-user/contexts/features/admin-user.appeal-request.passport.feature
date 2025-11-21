Feature: AdminUser Appeal Request Passport
	Scenario: Admin user can access listing appeal requests
		Given I have an admin user appeal request passport
		When I request access to a listing appeal request
		Then visa should be created with permission function

	Scenario: Admin user can access user appeal requests
		Given I have an admin user appeal request passport
		When I request access to a user appeal request
		Then visa should be created with permission function

	Scenario: Admin user passport extends base passport
		Given I create an admin user appeal request passport
		When I check its type
		Then it should be defined
