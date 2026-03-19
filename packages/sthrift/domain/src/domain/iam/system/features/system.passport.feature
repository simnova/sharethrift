Feature: <Passport> SystemPassport

  Scenario: Creating SystemPassport and accessing user passport
    Given I have a set of system permissions
    When I create a SystemPassport with those permissions
    And I access the user property
    Then it should return a SystemUserPassport instance initialized with those permissions
    And accessing user property again should return the same instance

  Scenario: Creating SystemPassport and accessing listing passport
    Given I have a set of system permissions
    When I create a SystemPassport with those permissions
    And I access the listing property
    Then it should return a SystemListingPassport instance initialized with those permissions
    And accessing listing property again should return the same instance

  Scenario: Creating SystemPassport and accessing conversation passport
    Given I have a set of system permissions
    When I create a SystemPassport with those permissions
    And I access the conversation property
    Then it should return a SystemConversationPassport instance initialized with those permissions
    And accessing conversation property again should return the same instance

  Scenario: Creating SystemPassport and accessing reservation request passport
    Given I have a set of system permissions
    When I create a SystemPassport with those permissions
    And I access the reservationRequest property
    Then it should return a SystemReservationRequestPassport instance initialized with those permissions
    And accessing reservationRequest property again should return the same instance

  Scenario: Creating SystemPassport and accessing account plan passport
    Given I have a set of system permissions
    When I create a SystemPassport with those permissions
    And I access the accountPlan property
    Then it should return a SystemAccountPlanPassport instance initialized with those permissions
    And accessing accountPlan property again should return the same instance

  Scenario: Creating SystemPassport and accessing appeal request passport
    Given I have a set of system permissions
    When I create a SystemPassport with those permissions
    And I access the appealRequest property
    Then it should return a SystemAppealRequestPassport instance initialized with those permissions
    And accessing appealRequest property again should return the same instance
