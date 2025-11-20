Feature: Admin Role Aggregate

  Background:
    Given I have an admin role repository
    And I have valid admin role data

  Scenario: Creating a new admin role instance
    When I call getNewInstance with roleName "Super Admin" and isDefault false
    Then a new admin role should be created
    And the role should have id
    And the role should have roleName "Super Admin"
    And the role should have isDefault false
    And the role should have default permissions

  Scenario: Getting roleName from admin role
    Given an existing admin role with roleName "Moderator"
    When I access the roleName property
    Then it should return "Moderator"

  Scenario: Setting roleName for admin role
    Given an existing admin role
    When I set roleName to "Content Manager"
    Then the roleName should be updated to "Content Manager"

  Scenario: Getting isDefault from admin role
    Given an existing admin role with isDefault true
    When I access the isDefault property
    Then it should return true

  Scenario: Setting isDefault for admin role
    Given an existing admin role
    When I set isDefault to true
    Then the isDefault should be updated to true

  Scenario: Getting permissions from admin role
    Given an existing admin role
    When I access the permissions property
    Then it should return a permissions object
    And the permissions should include userPermissions
    And the permissions should include conversationPermissions
    And the permissions should include listingPermissions
    And the permissions should include reservationRequestPermissions

  Scenario: Setting permissions for admin role
    Given an existing admin role
    When I set userPermissions with canBlockUsers true
    Then the permissions should be updated
    And canBlockUsers should be true
