Feature: User Appeal Request Index Exports

  Scenario: Exports from user-appeal-request index
    Then the UserAppealRequestConverter should be exported
    And the UserAppealRequestDomainAdapter should be exported
    And the UserAppealRequestRepository should be exported
    And the getUserAppealRequestUnitOfWork function should be exported
