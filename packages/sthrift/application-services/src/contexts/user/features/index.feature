Feature: User Context Factory

  Scenario: Creating User context with all services
    Given valid data sources
    When User context is created
    Then the context should be defined
    And PersonalUser service should be available
    And AdminUser service should be available

  Scenario: Verifying PersonalUser service methods
    Given valid data sources
    When User context is created
    Then PersonalUser should have createIfNotExists method
    And PersonalUser should have update method
    And PersonalUser should have queryById method
    And PersonalUser should have queryByEmail method
    And PersonalUser should have getAllUsers method

  Scenario: Verifying AdminUser service methods
    Given valid data sources
    When User context is created
    Then AdminUser should have createIfNotExists method
    And AdminUser should have update method
    And AdminUser should have queryById method
    And AdminUser should have queryByEmail method
    And AdminUser should have queryByUsername method
    And AdminUser should have blockUser method
    And AdminUser should have unblockUser method
    And AdminUser should have getAllUsers method
