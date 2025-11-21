Feature: PersonalUserDomainAdapter

  Background:
    Given a valid PersonalUser document

  Scenario: Getting the userType property
    When I get the userType property
    Then it should return the correct value

  Scenario: Setting the userType property
    When I set the userType property to "Sharer"
    Then the document's userType should be "Sharer"

  Scenario: Getting the isBlocked property
    When I get the isBlocked property
    Then it should return the correct value

  Scenario: Setting the isBlocked property
    When I set the isBlocked property to true
    Then the document's isBlocked should be true

  Scenario: Getting the account property
    When I get the account property
    Then it should return a PersonalUserAccountDomainAdapter with the correct data

  Scenario: Getting the hasCompletedOnboarding property
    When I get the hasCompletedOnboarding property
    Then it should return the correct value

  Scenario: Setting the hasCompletedOnboarding property
    When I set the hasCompletedOnboarding property to true
    Then the document's hasCompletedOnboarding should be true

  Scenario: Getting account when not initialized
    When the document account is undefined
    Then getting account should initialize it with empty object

  Scenario: Accessing account profile property
    When I access the account profile property
    Then it should return a PersonalUserAccountProfileDomainAdapter
    And the profile should have firstName and lastName

  Scenario: Accessing profile location property
    When I access the profile location property
    Then it should return a PersonalUserAccountProfileLocationDomainAdapter
    And the location should have address and city

  Scenario: Accessing profile billing property
    When I access the profile billing property
    Then it should return a PersonalUserAccountProfileBillingDomainAdapter
    And the billing should have payment state

  Scenario: Setting account email through adapter
    When I set the account email to "newemail@test.com"
    Then the account email should be "newemail@test.com"

  Scenario: Setting account username through adapter
    When I set the account username to "newusername"
    Then the account username should be "newusername"

  Scenario: Setting profile firstName through adapter
    When I set the profile firstName to "John"
    Then the profile firstName should be "John"

  Scenario: Setting profile lastName through adapter
    When I set the profile lastName to "Doe"
    Then the profile lastName should be "Doe"

  Scenario: Setting profile location address through adapter
    When I set the profile location address1 to "456 New St"
    Then the profile location address1 should be "456 New St"

  Scenario: Setting profile billing payment state
    When I set the profile billing paymentState to "active"
    Then the profile billing paymentState should be "active"

  Scenario: Getting profile when not initialized
    When the account profile is undefined
    Then getting profile should initialize it with empty object

  Scenario: Getting location when not initialized
    When the profile location is undefined
    Then getting location should initialize it with empty object

  Scenario: Getting billing when not initialized
    When the profile billing is undefined
    Then getting billing should initialize it with empty object
