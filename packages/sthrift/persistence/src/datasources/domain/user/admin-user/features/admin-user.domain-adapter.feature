Feature: AdminUser Domain Adapter Property Access

  Background:
    Given a valid AdminUser document

  Scenario: Getting the userType property
    When I get the userType property
    Then it should return the correct value

  Scenario: Setting the userType property
    When I set the userType property to "SuperAdmin"
    Then the document's userType should be "SuperAdmin"

  Scenario: Getting the isBlocked property
    When I get the isBlocked property
    Then it should return the correct value

  Scenario: Setting the isBlocked property
    When I set the isBlocked property to true
    Then the document's isBlocked should be true

  Scenario: Getting the account property
    When I get the account property
    Then it should return an AdminUserAccountDomainAdapter with the correct data

  Scenario: Getting the role property
    When I get the role property
    Then it should return the correct role reference

  Scenario: Setting the role property
    When I set the role property to a new role
    Then the document's role should be updated
