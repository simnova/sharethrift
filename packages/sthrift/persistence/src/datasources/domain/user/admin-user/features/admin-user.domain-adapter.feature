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

  Scenario: Setting role property with missing id throws error
    When I set the role property to a reference missing id
    Then an error should be thrown indicating role reference is missing id

  Scenario: Loading role when it is an ObjectId
    When I call loadRole on an adapter with role as ObjectId
    Then it should populate and return an AdminRoleDomainAdapter

  Scenario: Accessing nested account properties
    When I access account email, username, and profile properties
    Then all nested properties should be accessible

  Scenario: Accessing nested profile location properties
    When I access profile location properties
    Then all location properties should be accessible


