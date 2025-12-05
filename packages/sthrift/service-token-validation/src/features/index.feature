Feature: ServiceTokenValidation Index
  As a developer
  I want to ensure the ServiceTokenValidation is properly exported
  So that I can use it in my application

  Background:
    Given the service-token-validation module is available

  Scenario: Exporting ServiceTokenValidation class
    When I import ServiceTokenValidation from the index
    Then it should be a constructor function
    And it should have the expected properties and methods

  Scenario: Exporting TokenValidation interface
    When I import the TokenValidation type from the index
    Then it should be properly exported as a type

  Scenario: Exporting TokenValidationResult interface
    When I import the TokenValidationResult type from the index
    Then it should be properly exported as a type
