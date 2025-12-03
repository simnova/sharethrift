Feature: AdminUserReadRepositoryImpl Admin User Read Repository Implementation

	Background:
		Given a valid models context with AdminUser model
		And a valid passport for domain operations

	Scenario: Creating Admin User Read Repository Implementation
		When I call AdminUserReadRepositoryImpl with models and passport
		Then I should receive an object with AdminUserReadRepo property
		And the AdminUserReadRepo should be an AdminUserReadRepository instance

	Scenario: AdminUserReadRepositoryImpl exports
		Then AdminUserReadRepositoryImpl should be exported from index
		And AdminUserReadRepositoryImpl should be a function
		And AdminUserReadRepository type should be exported from index
