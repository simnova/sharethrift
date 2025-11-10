Feature: Message Value Objects

  Scenario: Creating a TwilioMessageSid with valid value
    When I create a TwilioMessageSid with "IM12345678901234567890123456789012"
    Then the value should be "IM12345678901234567890123456789012"

  Scenario: Creating a TwilioMessageSid with invalid prefix
    When I try to create a TwilioMessageSid with "XX12345678901234567890123456789012"
    Then an error should be thrown indicating the value is invalid

  Scenario: Creating a TwilioMessageSid with too short value
    When I try to create a TwilioMessageSid with a string of 33 characters
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a TwilioMessageSid with too long value
    When I try to create a TwilioMessageSid with a string of 35 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a TwilioMessageSid with null
    When I try to create a TwilioMessageSid with null
    Then an error should be thrown indicating the value is invalid

  Scenario: Creating a MessageContent with valid value
    When I create a MessageContent with "Hello, this is a test message"
    Then the value should be "Hello, this is a test message"

  Scenario: Creating a MessageContent with leading and trailing whitespace
    When I create a MessageContent with "  Hello  "
    Then the value should be "Hello"

  Scenario: Creating a MessageContent with minimum length
    When I create a MessageContent with "A"
    Then the value should be "A"

  Scenario: Creating a MessageContent with maximum length
    When I create a MessageContent with a string of 2000 characters
    Then the value should be the 2000 character string

  Scenario: Creating a MessageContent with empty string
    When I try to create a MessageContent with an empty string
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a MessageContent with too long value
    When I try to create a MessageContent with a string of 2001 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a MessageContent with null
    When I try to create a MessageContent with null
    Then an error should be thrown indicating the value is invalid
