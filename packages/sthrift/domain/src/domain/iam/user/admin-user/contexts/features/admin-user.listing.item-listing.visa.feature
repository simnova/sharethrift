Feature: Admin User Listing Item Listing Visa

  Background:
    Given an admin user with role permissions
    And an item listing entity reference

  Scenario: Admin can view all listings by default
    Given an admin user
    When I check if admin can view item listing
    Then the permission should always be granted

  Scenario: Admin can create listing with edit users permission
    Given the admin has canEditUsers permission
    When I check if admin can create item listing
    Then the permission should be granted

  Scenario: Admin can update listing with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can update item listing
    Then the permission should be granted

  Scenario: Admin can delete listing with delete content permission
    Given the admin has canDeleteContent permission
    When I check if admin can delete item listing
    Then the permission should be granted

  Scenario: Admin can publish listing with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can publish item listing
    Then the permission should be granted

  Scenario: Admin can unpublish listing with moderation permission
    Given the admin has canModerateListings permission
    When I check if admin can unpublish item listing
    Then the permission should be granted
