Feature: Listing Context Factory

  Scenario: Creating Listing context with all services
    Given valid data sources
    When Listing context is created
    Then the context should be defined
    And ItemListing service should be available

  Scenario: Verifying ItemListing service methods
    Given valid data sources
    When Listing context is created
    Then ItemListing should have create method
    And ItemListing should have update method
    And ItemListing should have deleteListings method
    And ItemListing should have cancel method
    And ItemListing should have unblock method
    And ItemListing should have queryById method
    And ItemListing should have queryBySharer method
    And ItemListing should have queryAll method
    And ItemListing should have queryPaged method
