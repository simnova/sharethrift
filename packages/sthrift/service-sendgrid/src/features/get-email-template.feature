Feature: Email Template Reader
  As a developer
  I want to read email templates from files
  So that I can use them for sending emails

  Scenario: Reading a JSON template file
    Given a JSON email template file exists
    When readHtmlFile is called with the template name
    Then it should return the file contents

  Scenario: Reading a template file with .json extension
    Given a JSON email template file exists
    When readHtmlFile is called with the full filename including extension
    Then it should return the file contents

  Scenario: Attempting to read a non-JSON file
    Given a file with non-JSON extension
    When readHtmlFile is called
    Then it should throw an error indicating wrong format

  Scenario: Attempting to read a non-existent file
    Given a non-existent template name
    When readHtmlFile is called
    Then it should throw a file not found error

  Scenario: Case-insensitive file matching
    Given a template file with mixed case name
    When readHtmlFile is called with different casing
    Then it should find and return the file contents
