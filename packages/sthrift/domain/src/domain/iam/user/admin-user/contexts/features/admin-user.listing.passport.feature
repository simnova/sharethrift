Feature: AdminUser Listing Passport
	Scenario: Admin user can access item listings
		Given I have an admin user listing passport
		When I request access to an item listing
		Then visa should be created with permission function

	Scenario: Admin user listing passport is defined
		Given I create an admin user listing passport
		When I check the passport
		Then it should be defined
