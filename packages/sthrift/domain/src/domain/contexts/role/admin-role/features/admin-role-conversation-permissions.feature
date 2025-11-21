Feature: Admin Role Conversation Permissions

Scenario: Admin role conversation permissions should have canViewAllConversations
	Given I have admin role conversation permissions
	When I access the canViewAllConversations property
	Then it should be a boolean

Scenario: Admin role conversation permissions should have canEditConversations
	Given I have admin role conversation permissions
	When I access the canEditConversations property
	Then it should be a boolean

Scenario: Admin role conversation permissions should have canDeleteConversations
	Given I have admin role conversation permissions
	When I access the canDeleteConversations property
	Then it should be a boolean

Scenario: Admin role conversation permissions should have canCloseConversations
	Given I have admin role conversation permissions
	When I access the canCloseConversations property
	Then it should be a boolean
