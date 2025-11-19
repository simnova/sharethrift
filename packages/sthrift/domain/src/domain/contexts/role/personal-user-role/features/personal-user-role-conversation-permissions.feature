Feature: Personal User Role Conversation Permissions

Background:
	Given I have conversation permissions props

Scenario: Conversation permissions canCreateConversation should be a boolean
	When I create a PersonalUserRoleConversationPermissions instance
	Then canCreateConversation should be a boolean

Scenario: Conversation permissions canManageConversation should be a boolean
	When I create a PersonalUserRoleConversationPermissions instance
	Then canManageConversation should be a boolean

Scenario: Conversation permissions canViewConversation should be a boolean
	When I create a PersonalUserRoleConversationPermissions instance
	Then canViewConversation should be a boolean

Scenario: Conversation permissions should support setter methods
	When I create a PersonalUserRoleConversationPermissions instance and modify values
	Then the values should be updated
