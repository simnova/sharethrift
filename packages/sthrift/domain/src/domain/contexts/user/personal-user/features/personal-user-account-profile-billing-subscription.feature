Feature: Personal User Account Profile Billing Subscription

  Background:
    Given I have valid billing subscription props

  Scenario: Creating a billing subscription instance
    When I create a PersonalUserAccountProfileBillingSubscription instance
    Then the subscription should be created successfully

  Scenario: Getting subscriptionId from subscription
    Given I have a subscription with subscriptionId "sub-12345"
    When I access the subscriptionId property
    Then it should return "sub-12345"

  Scenario: Getting planCode from subscription
    Given I have a subscription with planCode "premium"
    When I access the planCode property
    Then it should return "premium"

  Scenario: Getting status from subscription
    Given I have a subscription with status "ACTIVE"
    When I access the status property
    Then it should return "ACTIVE"

  Scenario: Getting startDate from subscription
    Given I have a subscription with a valid startDate
    When I access the startDate property
    Then it should return the expected date

  Scenario: Setting subscriptionId with valid visa
    Given I have a subscription with a permissive visa
    When I set the subscriptionId to "sub-new-123"
    Then the subscriptionId should be updated to "sub-new-123"

  Scenario: Setting planCode with valid visa
    Given I have a subscription with a permissive visa
    When I set the planCode to "enterprise"
    Then the planCode should be updated to "enterprise"

  Scenario: Setting status with valid visa
    Given I have a subscription with a permissive visa
    When I set the status to "CANCELLED"
    Then the status should be updated to "CANCELLED"

  Scenario: Setting startDate with valid visa
    Given I have a subscription with a permissive visa
    When I set the startDate to a new date
    Then the startDate should be updated

  Scenario: Setting subscriptionId without permission throws error
    Given I have a subscription with a restrictive visa
    When I attempt to set the subscriptionId without permission
    Then it should throw a PermissionError for subscription

  Scenario: Setting planCode without permission throws error
    Given I have a subscription with a restrictive visa
    When I attempt to set the planCode without permission
    Then it should throw a PermissionError for subscription

  Scenario: Setting status without permission throws error
    Given I have a subscription with a restrictive visa
    When I attempt to set the status without permission
    Then it should throw a PermissionError for subscription

  Scenario: Setting startDate without permission throws error
    Given I have a subscription with a restrictive visa
    When I attempt to set the startDate without permission
    Then it should throw a PermissionError for subscription

  Scenario: Setting properties when entity is new bypasses visa check
    Given I have a subscription for a new entity
    When I set the subscriptionId to "sub-new-entity"
    Then the subscriptionId should be updated to "sub-new-entity"
