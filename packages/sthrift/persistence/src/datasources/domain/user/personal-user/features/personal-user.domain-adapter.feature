Feature: PersonalUserDomainAdapter

  Background:
    Given a valid PersonalUser document with populated role

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

  Scenario: Getting the role property when populated
    When I get the role property
    Then it should return a PersonalUserRoleDomainAdapter with the correct doc

  Scenario: Getting the role property when not populated
    When I get the role property on a doc with no role
    Then an error should be thrown indicating role is not populated

  Scenario: Getting the role property when it is an ObjectId
    When I get the role property on a doc with role as ObjectId
    Then an error should be thrown indicating role is not populated or is not of the correct type

  Scenario: Setting the role property
    When I set the role property to a valid PersonalUserRoleDomainAdapter
    Then the document's role should be set to the role doc

  Scenario: Getting the account property
    When I get the account property
    Then it should return a PersonalUserAccountDomainAdapter with the correct data

  Scenario: Getting the hasCompletedOnboarding property
    When I get the hasCompletedOnboarding property
    Then it should return the correct value

  Scenario: Setting the hasCompletedOnboarding property
    When I set the hasCompletedOnboarding property to true
    Then the document's hasCompletedOnboarding should be true
