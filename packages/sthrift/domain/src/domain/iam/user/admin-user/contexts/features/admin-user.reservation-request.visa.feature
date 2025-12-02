Feature: Admin User Reservation Request Visa

  Background:
    Given an admin user with role permissions
    And a reservation request entity reference

  Scenario: Admin can close request with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can close request
    Then the permission should be granted

  Scenario: Admin can cancel request with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can cancel request
    Then the permission should be granted

  Scenario: Admin can accept request with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can accept request
    Then the permission should be granted

  Scenario: Admin can reject request with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can reject request
    Then the permission should be granted

  Scenario: Admin cannot manage requests without moderation permission
    Given the admin does not have canModerateListings permission
    When I check if admin can close request
    Then the permission should be denied
