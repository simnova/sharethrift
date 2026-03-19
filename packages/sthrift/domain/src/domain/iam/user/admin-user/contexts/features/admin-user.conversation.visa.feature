Feature: Admin User Conversation Visa

  Background:
    Given an admin user with role permissions
    And a conversation entity reference

  Scenario: Admin can create conversation with conversation edit permissions
    Given the admin has canEditConversations permission
    When I check if admin can create conversation
    Then the permission should be granted

  Scenario: Admin cannot create conversation without conversation edit permissions
    Given the admin does not have canEditConversations permission
    When I check if admin can create conversation
    Then the permission should be denied

  Scenario: Admin can manage conversation with moderation permissions
    Given the admin has canModerateConversations permission
    When I check if admin can manage conversation
    Then the permission should be granted

  Scenario: Admin can view conversation with view all conversations permission
    Given the admin has canViewAllConversations permission
    When I check if admin can view conversation
    Then the permission should be granted
