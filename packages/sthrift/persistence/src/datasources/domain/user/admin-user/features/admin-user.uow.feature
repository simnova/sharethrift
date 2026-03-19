Feature: AdminUser Unit of Work Creation

  Background:
    Given a Mongoose context factory with a working service
    And a valid AdminUser model from the models context
    And a valid passport for domain operations

  Scenario: Creating an AdminUser Unit of Work
    When I call getAdminUserUnitOfWork with the AdminUser model and passport
    Then I should receive a properly initialized AdminUserUnitOfWork
    And the Unit of Work should have the correct methods
