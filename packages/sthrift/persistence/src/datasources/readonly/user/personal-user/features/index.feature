Feature: PersonalUserReadRepositoryImpl Personal User Read Repository Implementation

	Background:
		Given a valid models context with PersonalUser model
		And a valid passport for domain operations

	Scenario: Creating Personal User Read Repository Implementation
		When I call PersonalUserReadRepositoryImpl with models and passport
		Then I should receive an object with PersonalUserReadRepo property
		And the PersonalUserReadRepo should be a PersonalUserReadRepository instance

	Scenario: PersonalUserReadRepositoryImpl exports
		Then PersonalUserReadRepositoryImpl should be exported from index
		And PersonalUserReadRepositoryImpl should be a function
		And PersonalUserReadRepository type should be exported from index
