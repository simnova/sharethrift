Feature: ListingAppealRequestDomainAdapter

  Background:
    Given a valid ListingAppealRequest document

  Scenario: Getting the userId property
    When I get the userId property
    Then it should return the correct value

  Scenario: Getting the listingId property
    When I get the listingId property
    Then it should return the correct value

  Scenario: Getting the reason property
    When I get the reason property
    Then it should return the correct value

  Scenario: Getting the blockerId property
    When I get the blockerId property
    Then it should return the correct value
