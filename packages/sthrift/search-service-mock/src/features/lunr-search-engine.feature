Feature: Lunr Search Engine

  Scenario: Building an index from documents
    When I build an index with fields and documents
    Then the index should exist

  Scenario: Adding a document to index
    Given an index with documents exists
    When I add a new document
    Then the document should be searchable

  Scenario: Removing a document from index
    Given an index with documents exists
    When I remove a document by id
    Then the document should not be searchable

  Scenario: Searching documents by keyword
    Given an index with bike documents exists
    When I search for "Bike"
    Then matching results should be returned

  Scenario: Filtering search results
    Given an index with categorized documents exists
    When I search with filter "category eq 'Tools'"
    Then only results with category "Tools" should be returned

  Scenario: Combining search and filter
    Given an index with bike documents exists
    When I search for "Bike" with filter "price gt 600"
    Then only matching filtered results should be returned

  Scenario: Handling pagination
    Given an index with 5 documents exists
    When I search with skip 1 and top 2
    Then 2 results should be returned

  Scenario: Sorting search results
    Given an index with priced documents exists
    When I search with orderBy "price asc"
    Then results should be sorted by price ascending

  Scenario: Returning facet counts
    Given an index with categorized documents exists
    When I search with facets for "category"
    Then category facets with counts should be returned
