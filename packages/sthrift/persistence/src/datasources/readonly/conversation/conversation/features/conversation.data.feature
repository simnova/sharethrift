Feature: <DataSource> ConversationDataSource

Background:
Given a ConversationDataSource instance with model

	Scenario: DataSource initialization
		Then the data source should be defined
		And the data source should have a model property
