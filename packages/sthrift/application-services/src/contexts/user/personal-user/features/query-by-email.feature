Feature: Query User By Email

  Scenario: Successfully finding user by email
    Given a valid email "user@example.com"
    And a user with this email exists
    When the queryByEmail command is executed
    Then the user should be returned

  Scenario: User not found by email
    Given an email "nonexistent@example.com"
    And no user with this email exists
    When the queryByEmail command is executed
    Then undefined should be returned
