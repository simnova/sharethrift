Feature: <DataSource> PersonalUserDataSource

Background:
Given a PersonalUserDataSource instance with model

	Scenario: DataSource initialization
		Then the data source should be defined
		And the data source should have a model property
