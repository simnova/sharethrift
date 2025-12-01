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
