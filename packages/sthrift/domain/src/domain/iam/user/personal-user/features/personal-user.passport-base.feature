Feature: PersonalUserPassportBase
	Scenario: PersonalUserPassportBase should be defined
		Given I have the PersonalUserPassportBase class
		When I check the class type
		Then it should be defined

	Scenario: PersonalUserPassportBase should accept a user entity
		Given I have a personal user entity
		When I create a PersonalUserPassportBase instance
		Then it should store the user entity
