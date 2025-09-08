Feature: Conversation value objects

  # TwilioConversationSid
  Scenario: Creating a TwilioConversationSid with valid value
    When I create a TwilioConversationSid with "CH12345678901234567890123456789012"
    Then the value should be "CH12345678901234567890123456789012"

  Scenario: Creating a TwilioConversationSid with invalid prefix
    When I try to create a TwilioConversationSid with "XX12345678901234567890123456789012"
    Then an error should be thrown indicating the value is invalid

  Scenario: Creating a TwilioConversationSid with too short value
    When I try to create a TwilioConversationSid with a string of 33 characters
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a TwilioConversationSid with too long value
    When I try to create a TwilioConversationSid with a string of 35 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a TwilioConversationSid with null
    When I try to create a TwilioConversationSid with null
    Then an error should be thrown indicating the value is invalid

  # TwilioParticipantSid
  Scenario: Creating a TwilioParticipantSid with valid value
    When I create a TwilioParticipantSid with "MB12345678901234567890123456789012"
    Then the value should be "MB12345678901234567890123456789012"

  Scenario: Creating a TwilioParticipantSid with invalid prefix
    When I try to create a TwilioParticipantSid with "XX12345678901234567890123456789012"
    Then an error should be thrown indicating the value is invalid

  Scenario: Creating a TwilioParticipantSid with too short value
    When I try to create a TwilioParticipantSid with a string of 33 characters
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a TwilioParticipantSid with too long value
    When I try to create a TwilioParticipantSid with a string of 35 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a TwilioParticipantSid with null
    When I try to create a TwilioParticipantSid with null
    Then an error should be thrown indicating the value is invalid
