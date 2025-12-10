Feature: Lunr Search Engine

  Scenario: Building an index from documents
    Given a LunrSearchEngine instance
    When I build an index with fields and documents
    Then the index should exist

  Scenario: Storing correct document count
    Given a LunrSearchEngine instance
    When I build an index with 5 documents
    Then the index stats should show 5 documents

  Scenario: Storing correct field count
    Given a LunrSearchEngine instance
    When I build an index with 6 fields
    Then the index stats should show 6 fields

  Scenario: Handling empty document array
    Given a LunrSearchEngine instance
    When I build an index with no documents
    Then the index should exist
    And the document count should be 0

  Scenario: Rebuilding index with updated documents
    Given a LunrSearchEngine instance with an existing index
    When I add a new document and rebuild
    Then the document count should increase

  Scenario: Warning for non-existent index rebuild
    Given a LunrSearchEngine instance
    When I try to rebuild a non-existent index
    Then it should not throw but warn

  Scenario: Adding a document to an index
    Given a LunrSearchEngine instance with an empty index
    When I add a document
    Then the document count should be 1

  Scenario: Making document searchable after adding
    Given a LunrSearchEngine instance with an empty index
    When I add a document with "Mountain" in title
    Then searching for "Mountain" should return results

  Scenario: Warning for adding to non-existent index
    Given a LunrSearchEngine instance
    When I try to add a document to a non-existent index
    Then it should not throw but warn

  Scenario: Warning for document without id
    Given a LunrSearchEngine instance with an empty index
    When I try to add a document without an id
    Then it should not throw but warn

  Scenario: Removing a document from index
    Given a LunrSearchEngine instance with indexed documents
    When I remove a document by id
    Then the document count should decrease

  Scenario: Making document unsearchable after removal
    Given a LunrSearchEngine instance with a "Mountain" document
    When I remove the document
    Then searching for "Mountain" should return no results

  Scenario: Warning for removing from non-existent index
    Given a LunrSearchEngine instance
    When I try to remove a document from a non-existent index
    Then it should not throw but warn

  Scenario: Finding documents by keyword
    Given a LunrSearchEngine instance with bike documents
    When I search for "Bike"
    Then at least 2 results should be returned

  Scenario: Returning relevance scores
    Given a LunrSearchEngine instance with bike documents
    When I search for "Bike"
    Then all results should have scores greater than 0

  Scenario: Wildcard search returns all documents
    Given a LunrSearchEngine instance with 5 documents
    When I search with "*"
    Then all 5 documents should be returned

  Scenario: Empty search returns all documents
    Given a LunrSearchEngine instance with 5 documents
    When I search with empty string
    Then all 5 documents should be returned

  Scenario: Partial word matches with wildcards
    Given a LunrSearchEngine instance with documents
    When I search with "Moun*"
    Then at least 1 result should be returned

  Scenario: Empty results for non-existent index
    Given a LunrSearchEngine instance
    When I search a non-existent index
    Then 0 results should be returned

  Scenario: Handling malformed queries gracefully
    Given a LunrSearchEngine instance with documents
    When I search with malformed query
    Then 0 results should be returned without error

  Scenario: Filtering by category
    Given a LunrSearchEngine instance with categorized documents
    When I search with filter "category eq 'Tools'"
    Then 2 results should be returned
    And all results should have category "Tools"

  Scenario: Filtering by price comparison
    Given a LunrSearchEngine instance with priced documents
    When I search with filter "price gt 500"
    Then 2 results should be returned
    And all results should have price greater than 500

  Scenario: Combining search and filter
    Given a LunrSearchEngine instance with bike documents
    When I search for "Bike" with filter "price gt 600"
    Then 1 result should be returned
    And the result should be "Road Bike"

  Scenario: Limiting results with top
    Given a LunrSearchEngine instance with 5 documents
    When I search with top 2
    Then 2 results should be returned

  Scenario: Skipping results with skip
    Given a LunrSearchEngine instance with 5 documents
    When I search with skip 2
    Then 3 results should be returned
    And the first two documents should not be included

  Scenario: Combining skip and top
    Given a LunrSearchEngine instance with 5 documents
    When I search with skip 1 and top 2
    Then 2 results should be returned

  Scenario: Including total count
    Given a LunrSearchEngine instance with 5 documents
    When I search with top 2 and includeTotalCount
    Then the count should be 5

  Scenario: Sorting by price ascending
    Given a LunrSearchEngine instance with priced documents
    When I search with orderBy "price asc"
    Then results should be sorted by price ascending

  Scenario: Sorting by price descending
    Given a LunrSearchEngine instance with priced documents
    When I search with orderBy "price desc"
    Then results should be sorted by price descending

  Scenario: Sorting by title alphabetically
    Given a LunrSearchEngine instance with documents
    When I search with orderBy "title asc"
    Then results should be sorted alphabetically

  Scenario: Default relevance sorting for text search
    Given a LunrSearchEngine instance with documents
    When I search for "Bike" without orderBy
    Then results should be sorted by relevance score

  Scenario: Returning facet counts for category
    Given a LunrSearchEngine instance with categorized documents
    When I search with facets for "category"
    Then category facets should show 3 Sports and 2 Tools

  Scenario: Returning facet counts for multiple fields
    Given a LunrSearchEngine instance with documents
    When I search with facets for "category" and "brand"
    Then both category and brand facets should be returned

  Scenario: Sorting facets by count descending
    Given a LunrSearchEngine instance with documents
    When I search with facets for "category"
    Then facets should be sorted by count descending

  Scenario: Checking for non-existent index
    Given a LunrSearchEngine instance
    When I check if non-existent index exists
    Then it should return false

  Scenario: Checking for existing index
    Given a LunrSearchEngine instance with an index
    When I check if the index exists
    Then it should return true

  Scenario: Getting stats for non-existent index
    Given a LunrSearchEngine instance
    When I get stats for non-existent index
    Then it should return null

  Scenario: Getting stats for existing index
    Given a LunrSearchEngine instance with 5 documents and 6 fields
    When I get index stats
    Then stats should show 5 documents and 6 fields

  Scenario: Getting LiQE filter capabilities
    Given a LunrSearchEngine instance
    When I get filter capabilities
    Then it should include eq, ne, gt, lt operators
    And it should include contains function

  Scenario: Validating supported filters
    Given a LunrSearchEngine instance
    When I check if filters are supported
    Then "category eq 'Sports'" should be supported
    And "price gt 100" should be supported
    And empty filter should be supported

  Scenario: Rejecting unsupported filters
    Given a LunrSearchEngine instance
    When I check if "invalid query" is supported
    Then it should return false
