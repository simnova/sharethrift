Feature: PersonalUser Conversation Visa (typo filename - converstaion)
	Scenario: Personal user can view conversation as reserver
		Given I have a conversation where personal user is the reserver
		When I check if user can view the conversation
		Then permission should be granted

	Scenario: Personal user can view conversation as sharer
		Given I have a conversation where personal user is the sharer
		When I check if user can view the conversation
		Then permission should be granted

	Scenario: Personal user cannot view conversation when not a participant
		Given I have a conversation where personal user is not a participant
		When I check if user can view the conversation
		Then permission should be denied

	Scenario: Personal user can create conversations
		Given I have a personal user with conversation visa
		When I check if user can create a conversation
		Then permission should be granted

	Scenario: Personal user cannot manage conversations
		Given I have a personal user with conversation visa
		When I check if user can manage a conversation
		Then permission should be denied

	Scenario: Conversation visa is created properly
		Given I create a conversation visa
		When I check the visa
		Then it should have determineIf function
