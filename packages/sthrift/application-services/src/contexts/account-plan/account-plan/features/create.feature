Feature: Create Account Plan

  Scenario: Successfully creating an account plan
    Given a valid account plan command with name "Premium Plan"
    When the create command is executed
    Then a new account plan should be created

  Scenario: Creating account plan with all required fields
    Given an account plan command with all billing details
    When the create command is executed
    Then the account plan should have correct billing configuration

  Scenario: Creating account plan with optional setup fee
    Given an account plan command with setup fee of 50
    When the create command is executed
    Then the account plan should include the setup fee

  Scenario: Creating account plan without setup fee defaults to zero
    Given an account plan command without setup fee
    When the create command is executed
    Then the account plan should have zero setup fee

  Scenario: Account plan creation fails when save returns undefined
    Given a valid account plan command
    And the save operation returns undefined
    When the create command is executed
    Then an error should be thrown with message "Account plan not found"
