Feature: Admin User Appeal Request Listing Appeal Request Visa

  Background:
    Given an admin user
    And a listing appeal request entity reference

  Scenario: Non-blocked admin can create appeal request
    Given the admin is not blocked
    When I check if admin can create appeal request
    Then the permission should be granted

  Scenario: Blocked admin cannot create appeal request
    Given the admin is blocked
    When I check if admin can create appeal request
    Then the permission should be denied

  Scenario: Admin can update appeal request state if they own it
    Given the admin is the owner of the appeal request
    When I check if admin can update appeal request state
    Then the permission should be granted

  Scenario: Admin cannot update appeal request state if they don't own it
    Given the admin is not the owner of the appeal request
    When I check if admin can update appeal request state
    Then the permission should be denied

  Scenario: Admin can view their own appeal request
    Given the admin is the owner of the appeal request
    When I check if admin can view appeal request
    Then the permission should be granted

  Scenario: Admin cannot view all appeal requests
    Given any admin user
    When I check if admin can view all appeal requests
    Then the permission should be denied
