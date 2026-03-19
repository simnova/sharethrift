Feature: AccountPlanDomainAdapter
  Background:
    Given a valid AccountPlan document

  Scenario: Getting the name property
    When I get the name property
    Then it should return the correct value

  Scenario: Setting the name property
    When I set the name property to "Basic"
    Then the document's name should be "Basic"

  Scenario: Getting the feature property when present
    When I get the feature property
    Then it should return a feature adapter with the correct doc

  Scenario: Getting the feature property when missing
    Given the feature property is missing
    When I get the feature property
    Then it should create and return a feature adapter

  Scenario: Setting the billingAmount property
    When I set the billingAmount property to 200
    Then the document's billingAmount should be 200

  Scenario: Getting the description property
    When I get the description property
    Then it should return the correct description

  Scenario: Setting the description property
    When I set the description property to "Starter plan"
    Then the document's description should be "Starter plan"

  Scenario: Getting the billingPeriodLength property
    When I get the billingPeriodLength property
    Then it should return the correct billingPeriodLength

  Scenario: Setting the billingPeriodLength property
    When I set the billingPeriodLength property to 6
    Then the document's billingPeriodLength should be 6

  Scenario: Getting the billingPeriodUnit property
    When I get the billingPeriodUnit property
    Then it should return the correct billingPeriodUnit

  Scenario: Setting the billingPeriodUnit property
    When I set the billingPeriodUnit property to "Y"
    Then the document's billingPeriodUnit should be "Y"

  Scenario: Getting the billingCycles property
    When I get the billingCycles property
    Then it should return the correct billingCycles

  Scenario: Setting the billingCycles property
    When I set the billingCycles property to 3
    Then the document's billingCycles should be 3

  Scenario: Getting the currency property
    When I get the currency property
    Then it should return the correct currency

  Scenario: Setting the currency property
    When I set the currency property to "EUR"
    Then the document's currency should be "EUR"

  Scenario: Getting the setupFee property
    When I get the setupFee property
    Then it should return the correct setupFee

  Scenario: Setting the setupFee property
    When I set the setupFee property to 20
    Then the document's setupFee should be 20

  Scenario: Getting the status property
    When I get the status property
    Then it should return the correct status

  Scenario: Setting the status property
    When I set the status property to "INACTIVE"
    Then the document's status should be "INACTIVE"

  Scenario: Getting the cybersourcePlanId property
    When I get the cybersourcePlanId property
    Then it should return the correct cybersourcePlanId

  Scenario: Setting the cybersourcePlanId property
    When I set the cybersourcePlanId property to "cs-999"
    Then the document's cybersourcePlanId should be "cs-999"

  # Feature adapter property scenarios
  Scenario: Getting the activeReservations property
    When I get the activeReservations property from the feature adapter
    Then it should return the correct activeReservations

  Scenario: Setting the activeReservations property
    When I set the activeReservations property to 10 in the feature adapter
    Then the feature's activeReservations should be 10

  Scenario: Getting the bookmarks property
    When I get the bookmarks property from the feature adapter
    Then it should return the correct bookmarks

  Scenario: Setting the bookmarks property
    When I set the bookmarks property to 20 in the feature adapter
    Then the feature's bookmarks should be 20

  Scenario: Getting the itemsToShare property
    When I get the itemsToShare property from the feature adapter
    Then it should return the correct itemsToShare

  Scenario: Setting the itemsToShare property
    When I set the itemsToShare property to 30 in the feature adapter
    Then the feature's itemsToShare should be 30

  Scenario: Getting the friends property
    When I get the friends property from the feature adapter
    Then it should return the correct friends

  Scenario: Setting the friends property
    When I set the friends property to 40 in the feature adapter
    Then the feature's friends should be 40
