Feature: AccountPlanRepository

Background:
Given an AccountPlanRepository instance with a working Mongoose model, type converter, and passport
And valid AccountPlan documents exist in the database

  Scenario: Getting an account plan by ID
    Given an AccountPlan document with id "plan-1"
    When I call getById with "plan-1"
    Then I should receive an AccountPlan domain object
    And the domain object's id should be "plan-1"

  Scenario: Getting an account plan by nonexistent ID
    When I call getById with "nonexistent-id"
    Then an error should be thrown indicating "AccountPlan with id nonexistent-id not found"

  Scenario: Getting all account plans
    Given multiple AccountPlan documents exist
    When I call getAll
    Then I should receive an array of AccountPlan domain objects
    And the array should contain the expected plans

  Scenario: Getting all account plans when none exist
    When I call getAll with no documents
    Then I should receive an empty array

  Scenario: Creating a new account plan instance
    Given plan info with name "Basic Plan"
    And billing period of 1 month
    And billing amount of 9.99
    When I call getNewInstance with the plan info
    Then I should receive a new AccountPlan domain object
    And the domain object should have the correct name
    And the domain object should have the correct billing info
