Feature: PersonalUser User Passport
	Scenario: Personal user can access personal user entities
		Given I have a personal user user passport
		When I request access to a personal user entity
		Then visa should be created with permission function

	Scenario: Personal user cannot access admin user entities
		Given I have a personal user user passport
		When I request access to an admin user entity
		Then visa should deny all permissions

	Scenario: Personal user user passport is defined
		Given I create a personal user user passport
		When I check the passport
		Then it should be defined and be instance of PersonalUserUserPassport
