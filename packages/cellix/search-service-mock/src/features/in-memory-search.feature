Feature: In-Memory Cognitive Search

  Scenario: Creating an index successfully
    Given an InMemoryCognitiveSearch service is initialized
    When I create a test index with searchable and facetable fields
    Then the index should exist in the service
    And the document count should be 0

  Scenario: Indexing a document
    Given an InMemoryCognitiveSearch service with a test index
    When I index a document with id, title, and category
    Then the document count should be 1

  Scenario: Searching documents by text
    Given an InMemoryCognitiveSearch service with indexed documents
    When I search for "Test"
    Then I should find 1 document
    And the document title should be "Test Document"

  Scenario: Filtering documents by field value
    Given an InMemoryCognitiveSearch service with multiple documents
    When I search with filter "category eq 'test'"
    Then I should find 1 document
    And the document category should be "test"

  Scenario: Deleting a document
    Given an InMemoryCognitiveSearch service with an indexed document
    When I delete the document
    Then the document count should be 0

  Scenario: Handling pagination with skip and top
    Given an InMemoryCognitiveSearch service with 5 documents
    When I search with skip 1 and top 2
    Then I should get 2 results
    And the total count should be 5

  Scenario: Preventing duplicate index creation
    Given an InMemoryCognitiveSearch service with a test index
    When I create the same index again
    Then only one index should exist

  Scenario: Shutting down and restarting service
    Given an InMemoryCognitiveSearch service
    When I shut down and restart the service
    Then the service should start successfully

  Scenario: Starting up service multiple times
    Given an InMemoryCognitiveSearch service
    When I call startUp multiple times
    Then all calls should return the same instance

  Scenario: Searching non-existent index
    Given an InMemoryCognitiveSearch service
    When I search a non-existent index
    Then I should get 0 results
    And the count should be 0
    And facets should be empty

  Scenario: Indexing document to non-existent index
    Given an InMemoryCognitiveSearch service
    When I try to index a document to a non-existent index
    Then it should throw "Index non-existent does not exist"

  Scenario: Indexing document without id
    Given an InMemoryCognitiveSearch service with a test index
    When I try to index a document without an id field
    Then it should throw "Document must have an id field"

  Scenario: Deleting document from non-existent index
    Given an InMemoryCognitiveSearch service
    When I try to delete a document from a non-existent index
    Then it should throw "Index non-existent does not exist"

  Scenario: Deleting document without id
    Given an InMemoryCognitiveSearch service with a test index
    When I try to delete a document without an id field
    Then it should throw "Document must have an id field"

  Scenario: Creating or updating index definition
    Given an InMemoryCognitiveSearch service
    When I create or update an index definition
    Then the index should exist

  Scenario: Updating existing index preserves documents
    Given an InMemoryCognitiveSearch service with an indexed document
    When I update the index definition with new fields
    Then the document count should remain 1

  Scenario: Deleting an index
    Given an InMemoryCognitiveSearch service with a test index and documents
    When I delete the index
    Then the index should not exist

  Scenario: Getting filter capabilities
    Given an InMemoryCognitiveSearch service
    When I get filter capabilities
    Then it should include operators, functions, and examples

  Scenario: Validating filter support
    Given an InMemoryCognitiveSearch service
    When I check if a filter is supported
    Then it should return a boolean value

  Scenario: Getting debug info with Lunr stats
    Given an InMemoryCognitiveSearch service with indexed documents
    When I get debug info
    Then it should include indexes, document counts, Lunr stats, and filter capabilities
