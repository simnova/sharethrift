Feature: Listing Search Application Service

  Scenario: Searching listings with basic text query
    Given a search service with indexed listings
    When I search for "camera"
    Then I should receive matching results
    And the search index should be created if not exists

  Scenario: Searching with empty search string
    Given a search service
    When I search with an empty search string
    Then it should default to wildcard search "*"

  Scenario: Trimming whitespace from search string
    Given a search service
    When I search with "  camera  "
    Then the search should use trimmed string "camera"

  Scenario: Filtering by category
    Given indexed listings with various categories
    When I search with category filter ["electronics", "sports"]
    Then only listings in those categories should be returned

  Scenario: Filtering by state
    Given indexed listings with various states
    When I search with state filter ["active", "draft"]
    Then only listings with those states should be returned

  Scenario: Filtering by sharer ID
    Given indexed listings from multiple sharers
    When I search with sharerId filter ["user-1", "user-2"]
    Then only listings from those sharers should be returned

  Scenario: Filtering by location
    Given indexed listings in different locations
    When I search with location filter "New York"
    Then only listings in that location should be returned

  Scenario: Filtering by date range with start date
    Given indexed listings with various dates
    When I search with dateRange.start "2024-01-01"
    Then only listings starting after that date should be returned

  Scenario: Filtering by date range with end date
    Given indexed listings with various dates
    When I search with dateRange.end "2024-12-31"
    Then only listings ending before that date should be returned

  Scenario: Filtering by date range with both dates
    Given indexed listings with various dates
    When I search with dateRange.start "2024-01-01" and dateRange.end "2024-12-31"
    Then only listings within that period should be returned

  Scenario: Combining multiple filters
    Given indexed listings
    When I search with category "electronics" and state "active" and location "Seattle"
    Then filters should be combined with AND logic

  Scenario: Applying pagination
    Given 100 indexed listings
    When I search with top 10 and skip 20
    Then I should receive 10 results starting from position 20

  Scenario: Using default pagination
    Given indexed listings
    When I search without pagination options
    Then default top should be 50 and skip should be 0

  Scenario: Applying custom sorting
    Given indexed listings
    When I search with orderBy ["title asc", "createdAt desc"]
    Then results should be sorted accordingly

  Scenario: Using default sorting
    Given indexed listings
    When I search without orderBy option
    Then results should be sorted by "updatedAt desc"

  Scenario: Converting facets in response
    Given search results with facets
    When I receive the search response
    Then facets should be converted to proper format
    And category facets should be available
    And state facets should be available

  Scenario: Handling response without facets
    Given search results without facets
    When I receive the search response
    Then the facets field should be undefined

  Scenario: Bulk indexing all listings successfully
    Given 10 listings in the database
    When I execute bulk indexing
    Then all 10 listings should be indexed
    And success message should indicate "10/10 listings"

  Scenario: Bulk indexing with no listings
    Given no listings in the database
    When I execute bulk indexing
    Then it should return early with message "No listings found to index"

  Scenario: Handling indexing errors gracefully
    Given 5 listings in the database
    And 2 listings will fail to index
    When I execute bulk indexing
    Then 3 listings should be successfully indexed
    And error should be logged for failed listings

  Scenario: Logging error stack traces
    Given a listing that will fail to index with stack trace
    When I execute bulk indexing
    Then the error stack trace should be logged

  Scenario: Creating index before bulk indexing
    Given listings in the database
    When I execute bulk indexing
    Then the search index should be created before indexing documents

  Scenario: Handling null search options
    Given a search service
    When I search with null options
    Then default options should be used

  Scenario: Handling null filter
    Given a search service
    When I search with null filter
    Then no filter should be applied

  Scenario: Handling empty filter arrays
    Given a search service
    When I search with empty category, state, and sharerId arrays
    Then an empty filter string should be produced

  Scenario: Handling undefined pagination values
    Given a search service
    When I search with null top and skip values
    Then default pagination should be used
