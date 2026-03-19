Feature: ShareThrift Search Service Index (Facade)

  Background:
    Given a ServiceSearchIndex instance

  Scenario: Initializing search service successfully
    When the search service starts up
    Then it should initialize with mock implementation
    And domain indexes should be created

  Scenario: Shutting down search service
    Given an initialized search service
    When the search service shuts down
    Then cleanup should complete successfully

  Scenario: Initializing with custom configuration
    Given custom persistence configuration
    When the search service starts up with config
    Then it should initialize with the provided settings

  Scenario: Creating item-listings index on startup
    When the search service starts up
    Then the listings index should be created automatically
    And searching listings should not throw errors

  Scenario: Creating a new index if not exists
    Given a custom index definition
    When I create the index
    Then the index should be available for use

  Scenario: Updating an existing index definition
    Given an existing listings index
    When I update the index definition with new fields
    Then the index should be updated successfully

  Scenario: Deleting an index
    Given a temporary index
    When I delete the index
    Then the index should no longer exist

  Scenario: Indexing a listing document
    Given a listing document
    When I index the listing
    Then the document should be added to the search index

  Scenario: Indexing a document to any index
    Given a listing document
    When I index the document directly to listings index
    Then the document should be added successfully

  Scenario: Deleting a listing document
    Given an indexed listing
    When I delete the listing
    Then the document should be removed from search index

  Scenario: Deleting a document from any index
    Given an indexed listing
    When I delete the document directly from listings index
    Then the document should be removed successfully

  Scenario: Searching listings by text
    Given indexed listings including "Vintage Camera"
    When I search listings for "camera"
    Then matching listings should be returned

  Scenario: Searching using generic search method
    Given indexed listings
    When I search the listings index for "bike"
    Then matching results should be returned

  Scenario: Wildcard search returns all documents
    Given 3 indexed listings
    When I search listings for "*"
    Then all 3 listings should be returned

  Scenario: Filtering by category
    Given listings in electronics and sports categories
    When I search with filter "category eq 'electronics'"
    Then only electronics listings should be returned

  Scenario: Filtering by state
    Given active and inactive listings
    When I search with filter "state eq 'active'"
    Then only active listings should be returned
    And inactive listings should not be included

  Scenario: Filtering by location
    Given listings in multiple locations
    When I search with filter "location eq 'Denver'"
    Then only Denver listings should be returned

  Scenario: Paginating search results
    Given 3 indexed listings
    When I search with top 2 and skip 0
    Then I should receive 2 listings
    And total count should be 3
    When I search with top 2 and skip 2
    Then I should receive 1 listing
    And total count should be 3

  Scenario: Ordering search results
    Given 3 indexed listings
    When I search with orderBy "title asc"
    Then results should be sorted alphabetically by title

  Scenario: Selecting specific fields
    Given indexed listings
    When I search with select ["id", "title", "category"]
    Then returned documents should contain selected fields

  Scenario: Retrieving facets
    Given indexed listings with various categories and states
    When I search with facets ["category", "state"]
    Then facet results should be included in response
    And category or state facets should be defined

  Scenario: Combining text search with filters
    Given listings with "bike" in title or description
    And some bikes are active, some inactive
    When I search for "bike" with filter "state eq 'active'"
    Then only active bike listings should be returned

  Scenario: Handling search on non-existent index
    When I search a non-existent index
    Then it should either return empty results or throw error

  Scenario: Handling invalid filter syntax
    When I search with invalid filter "invalid filter syntax!!!"
    Then the search should handle it gracefully
