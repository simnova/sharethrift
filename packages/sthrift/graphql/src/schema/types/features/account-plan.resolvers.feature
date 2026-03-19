Feature: AccountPlan Resolvers

As an API consumer
I want to query and mutate account plan entities
So that I can retrieve and create account plans through the GraphQL API

  Scenario: Querying all account plans
    When the accountPlans query is executed
    Then it should return a list of AccountPlan entities

  Scenario: Querying all account plans returns empty list
    When the accountPlans query is executed with no plans
    Then it should return an empty list

  Scenario: Querying all account plans when an error occurs
    When the accountPlans query throws an error
    Then it should propagate the error message

  Scenario: Querying an account plan by ID
    Given a valid account plan ID
    When the accountPlan query is executed with that ID
    Then it should call AccountPlan.AccountPlan.queryById with the provided accountPlanId
    And it should return the corresponding AccountPlan entity

  Scenario: Querying an account plan by ID that does not exist
    Given an account plan ID that does not match any record
    When the accountPlan query is executed
    Then it should return null

  Scenario: Querying an account plan by ID when an error occurs
    Given a valid account plan ID
    And AccountPlan.AccountPlan.queryById throws an error
    When the accountPlan query is executed with error
    Then it should propagate the error message

  Scenario: Creating an account plan successfully
    Given a valid AccountPlanCreateInput
    When the accountPlanCreate mutation is executed with that input
    Then it should call AccountPlan.AccountPlan.create with the provided input fields
    And it should return an AccountPlanMutationResult with success true and the created account plan

  Scenario: Creating an account plan when create throws an error
    Given a valid AccountPlanCreateInput
    And AccountPlan.AccountPlan.create throws an error
    When the accountPlanCreate mutation is executed
    Then it should return an AccountPlanMutationResult with success false and the error message
