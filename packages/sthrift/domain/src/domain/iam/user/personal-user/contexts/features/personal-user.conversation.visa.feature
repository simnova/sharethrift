Feature: PersonalUser Conversation Visa
	Scenario: Conversation visa evaluates permissions for participants
		Given I have a conversation visa as participant
		When I check view permission
		Then participant can view conversation

	Scenario: Conversation visa is created properly
		Given I create a conversation visa
		When I check the visa
		Then it should have determineIf function
