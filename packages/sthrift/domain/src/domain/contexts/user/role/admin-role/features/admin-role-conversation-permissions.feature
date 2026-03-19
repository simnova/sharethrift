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

Scenario: Admin role conversation permissions should have canModerateConversations
	Given I have admin role conversation permissions
	When I access the canModerateConversations property
	Then it should be a boolean

Scenario: Setting canViewAllConversations should update the value
	Given I have admin role conversation permissions with canViewAllConversations false
	When I set canViewAllConversations to true
	Then canViewAllConversations should be true

Scenario: Setting canEditConversations should update the value
	Given I have admin role conversation permissions with canEditConversations false
	When I set canEditConversations to true
	Then canEditConversations should be true

Scenario: Setting canDeleteConversations should update the value
	Given I have admin role conversation permissions with canDeleteConversations false
	When I set canDeleteConversations to true
	Then canDeleteConversations should be true

Scenario: Setting canCloseConversations should update the value
	Given I have admin role conversation permissions with canCloseConversations false
	When I set canCloseConversations to true
	Then canCloseConversations should be true

Scenario: Setting canModerateConversations should update the value
	Given I have admin role conversation permissions with canModerateConversations false
	When I set canModerateConversations to true
	Then canModerateConversations should be true
