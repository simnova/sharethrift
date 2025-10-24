Feature: <Passport> GuestPassport

  Scenario: Creating GuestPassport and accessing user passport
    When I create a GuestPassport
    And I access the user property
    Then it should return a GuestUserPassport instance
    And accessing user property again should return the same instance

  Scenario: Creating GuestPassport and accessing listing passport
    When I create a GuestPassport
    And I access the listing property
    Then it should return a GuestListingPassport instance
    And accessing listing property again should return the same instance

  Scenario: Creating GuestPassport and accessing conversation passport
    When I create a GuestPassport
    And I access the conversation property
    Then it should return a GuestConversationPassport instance
    And accessing conversation property again should return the same instance

  Scenario: Creating GuestPassport and accessing reservation request passport
    When I create a GuestPassport
    And I access the reservationRequest property
    Then it should return a GuestReservationRequestPassport instance
    And accessing reservationRequest property again should return the same instance
