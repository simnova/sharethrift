Feature: Search Engine Adapter

  Scenario: Building an index from fields and documents
    Given a SearchEngineAdapter instance
    When I build an index with fields and documents
    Then the index should exist

  Scenario: Building multiple indexes
    Given a SearchEngineAdapter instance
    When I build two different indexes
    Then both indexes should exist

  Scenario: Adding a document to an existing index
    Given a SearchEngineAdapter instance with an empty index
    When I add a document
    Then the document count should be 1

  Scenario: Adding multiple documents
    Given a SearchEngineAdapter instance with an empty index
    When I add three documents
    Then the document count should be 3

  Scenario: Removing a document from an index
    Given a SearchEngineAdapter instance with 3 documents
    When I remove one document
    Then the document count should be 2

  Scenario: Searching by text
    Given a SearchEngineAdapter instance with bike documents
    When I search for "Mountain"
    Then at least 1 result should be returned
    And the first result should have title "Mountain Bike"

  Scenario: Wildcard search returns all documents
    Given a SearchEngineAdapter instance with 3 documents
    When I search with "*"
    Then all 3 documents should be returned

  Scenario: Empty search returns all documents
    Given a SearchEngineAdapter instance with 3 documents
    When I search with empty string
    Then all 3 documents should be returned

  Scenario: Applying filters
    Given a SearchEngineAdapter instance with categorized documents
    When I search with filter "category eq 'Tools'"
    Then 1 result should be returned
    And the result should have category "Tools"

  Scenario: Applying pagination
    Given a SearchEngineAdapter instance with 3 documents
    When I search with skip 1 and top 1
    Then 1 result should be returned

  Scenario: Including count in results
    Given a SearchEngineAdapter instance with 3 documents
    When I search with includeTotalCount
    Then the count should be 3

  Scenario: Getting stats for non-existent index
    Given a SearchEngineAdapter instance
    When I get stats for a non-existent index
    Then it should return null

  Scenario: Getting statistics for existing index
    Given a SearchEngineAdapter instance with 3 documents and 5 fields
    When I get index stats
    Then stats should show 3 documents and 5 fields

  Scenario: Getting supported filter capabilities
    Given a SearchEngineAdapter instance
    When I get filter capabilities
    Then it should include eq, ne, gt, lt operators
    And it should include contains, startswith, endswith functions

  Scenario: Getting capability examples
    Given a SearchEngineAdapter instance
    When I get filter capabilities
    Then examples should have at least one entry

  Scenario: Validating valid filters
    Given a SearchEngineAdapter instance
    When I check if filters are supported
    Then "category eq 'Sports'" should return true
    And "price gt 100" should return true

  Scenario: Validating empty filter
    Given a SearchEngineAdapter instance
    When I check if empty filter is supported
    Then it should return true

  Scenario: Rejecting invalid filters
    Given a SearchEngineAdapter instance
    When I check if "invalid query" is supported
    Then it should return false

  Scenario: Checking for non-existent index
    Given a SearchEngineAdapter instance
    When I check if non-existent index exists
    Then it should return false

  Scenario: Checking for existing index
    Given a SearchEngineAdapter instance with an index
    When I check if the index exists
    Then it should return true
