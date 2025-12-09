Feature: AccountPlanUnitOfWork

Background:
Given a Mongoose context factory with a working service
And a valid AccountPlan model from the models context
And a valid passport for domain operations

  Scenario: Creating an AccountPlan Unit of Work
    When I call getAccountPlanUnitOfWork with the AccountPlan model and passport
    Then I should receive a properly initialized AccountPlanUnitOfWork
    And the Unit of Work should have the correct methods
