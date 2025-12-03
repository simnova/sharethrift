Feature: Admin User Application Service

  Scenario: Admin User service provides all required operations
    Given the Admin User application service is initialized
    When I check available operations
    Then it should provide createIfNotExists operation
    And it should provide queryById operation
    And it should provide queryByEmail operation
    And it should provide queryByUsername operation
    And it should provide update operation
    And it should provide getAllUsers operation
    And it should provide blockUser operation
    And it should provide unblockUser operation
