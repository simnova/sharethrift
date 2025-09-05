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

  # UserId
  Scenario: Creating a UserId with valid value
    When I create a UserId with "user-123"
    Then the value should be "user-123"

  Scenario: Creating a UserId with leading and trailing whitespace
    When I create a UserId with "  user-123  "
    Then the value should be "user-123"

  Scenario: Creating a UserId with too short value
    When I try to create a UserId with an empty string
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a UserId with too long value
    When I try to create a UserId with a string of 51 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a UserId with null
    When I try to create a UserId with null
    Then an error should be thrown indicating the value is invalid

  # ListingId
  Scenario: Creating a ListingId with valid value
    When I create a ListingId with "listing-123"
    Then the value should be "listing-123"

  Scenario: Creating a ListingId with leading and trailing whitespace
    When I create a ListingId with "  listing-123  "
    Then the value should be "listing-123"

  Scenario: Creating a ListingId with too short value
    When I try to create a ListingId with an empty string
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a ListingId with too long value
    When I try to create a ListingId with a string of 51 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a ListingId with null
    When I try to create a ListingId with null
    Then an error should be thrown indicating the value is invalid
