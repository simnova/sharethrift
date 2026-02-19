Feature: Admin User Reservation Request Visa

  Background:
    Given an admin user with role permissions
    And a reservation request entity reference

  Scenario: Admin can edit request with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can edit request
    Then the permission should be granted

  Scenario: Admin cannot edit requests without moderation permission
    Given the admin does not have canModerateListings permission
    When I check if admin can edit request
    Then the permission should be denied
