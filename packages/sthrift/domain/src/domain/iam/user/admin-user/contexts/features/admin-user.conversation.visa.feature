Feature: Admin User Conversation Visa

  Background:
    Given an admin user with role permissions
    And a conversation entity reference

  Scenario: Admin can create conversation with user edit permissions
    Given the admin has canEditUsers permission
    When I check if admin can create conversation
    Then the permission should be granted

  Scenario: Admin cannot create conversation without user edit permissions
    Given the admin does not have canEditUsers permission
    When I check if admin can create conversation
    Then the permission should be denied

  Scenario: Admin can manage conversation with moderation permissions
    Given the admin has canModerateListings permission
    When I check if admin can manage conversation
    Then the permission should be granted

  Scenario: Admin can view conversation with view all users permission
    Given the admin has canViewAllUsers permission
    When I check if admin can view conversation
    Then the permission should be granted
