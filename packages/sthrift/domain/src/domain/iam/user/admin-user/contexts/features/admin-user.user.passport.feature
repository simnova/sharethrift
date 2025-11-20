Feature: AdminUser User Passport
	Scenario: Admin user can access personal user entities
		Given I have an admin user user passport
		When I request access to a personal user
		Then visa should be created with permission function

	Scenario: Admin user can access admin user entities
		Given I have an admin user user passport
		When I request access to an admin user
		Then visa should be created with permission function

	Scenario: Admin user user passport is defined
		Given I create an admin user user passport
		When I check the passport
		Then it should be defined
