Feature: Services Interface
	Scenario: Services interface should define BlobStorage
		Given I have the Services interface
		When I check the interface properties
		Then it should have BlobStorage property

	Scenario: Services interface can be implemented
		Given I create a Services implementation
		When I use the implementation
		Then it should work correctly
