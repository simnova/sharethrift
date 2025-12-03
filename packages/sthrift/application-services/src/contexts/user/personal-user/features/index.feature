Feature: Personal User Application Service

  Scenario: Creating a personal user if not exists through the application service
    Given a personal user application service
    When I create a personal user if not exists
    Then it should delegate to the createIfNotExists function

  Scenario: Querying a personal user by ID through the application service
    Given a personal user application service
    When I query for personal user with id "user-123"
    Then it should delegate to the queryById function

  Scenario: Updating a personal user through the application service
    Given a personal user application service
    When I update personal user "user-123"
    Then it should delegate to the update function

  Scenario: Querying a personal user by email through the application service
    Given a personal user application service
    When I query for personal user with email "test@example.com"
    Then it should delegate to the queryByEmail function

  Scenario: Getting all personal users through the application service
    Given a personal user application service
    When I get all personal users
    Then it should delegate to the getAllUsers function
