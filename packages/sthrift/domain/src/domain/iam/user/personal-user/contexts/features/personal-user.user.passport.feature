Feature: PersonalUser User Passport
	Scenario: Personal user can access user entities
		Given I have a personal user user passport
		When I request access to a personal user
		Then visa should be created with permission function

	Scenario: Personal user user passport is defined
		Given I create a personal user user passport
		When I check the passport
		Then it should be defined

	Scenario: Personal user cannot access admin user for blocking
		Given I have a personal user user passport
		When I request access to an admin user
		Then visa should deny all blocking permissions

	Scenario: Personal user cannot access admin user for any operations
		Given I have a personal user user passport
		When I request access to an admin user
		Then visa should always return false for any permission check

	Scenario: PersonalToAdminUserVisa always returns false
		Given I have a personal user accessing an admin user
		When I check for any permission
		Then result should be false
