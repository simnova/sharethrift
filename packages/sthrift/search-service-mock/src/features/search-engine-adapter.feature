Feature: Search Engine Adapter

  Scenario: Building an index
    When I build an index with fields and documents
    Then the index should exist

  Scenario: Adding documents to index
    Given an empty index exists
    When I add documents
    Then the document count should increase

  Scenario: Removing a document
    Given an index with documents exists
    When I remove one document
    Then the document count should decrease

  Scenario: Searching by text
    Given an index with bike documents exists
    When I search for "Mountain"
    Then matching results should be returned

  Scenario: Applying filters
    Given an index with categorized documents exists
    When I search with filter "category eq 'Tools'"
    Then only filtered results should be returned

  Scenario: Handling pagination
    Given an index with 3 documents exists
    When I search with skip and top
    Then paginated results should be returned

  Scenario: Getting index statistics
    Given an index with documents exists
    When I get index stats
    Then stats should show document and field counts

  Scenario: Validating filter support
    When I check if "category eq 'Sports'" is supported
    Then it should return true
