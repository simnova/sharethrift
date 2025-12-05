Feature: PersonalUser AccountPlan Visa

  Scenario: Account plan visa is created properly
    Given I create an account plan visa with user and root
    When I check the visa instance
    Then it should have determineIf function

  Scenario: Account plan visa determines permissions correctly
    Given I create an account plan visa
    When I check canCreateAccountPlan permission
    Then it should return false

  Scenario: Account plan visa checks canUpdateAccountPlan permission
    Given I create an account plan visa
    When I check canUpdateAccountPlan permission
    Then it should return false

  Scenario: Account plan visa checks canDeleteAccountPlan permission
    Given I create an account plan visa
    When I check canDeleteAccountPlan permission
    Then it should return false
