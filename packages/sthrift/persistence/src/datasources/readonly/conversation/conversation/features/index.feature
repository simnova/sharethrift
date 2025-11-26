Feature: <Index> Conversation Readonly Index Exports

	Scenario: Exports from conversation readonly index
		Then the getConversationReadRepository function should be exported
		And getConversationReadRepository should be a function

	Scenario: Calling ConversationReadRepositoryImpl returns repository
		Given a models context and passport
		When I call ConversationReadRepositoryImpl
		Then it should return an object with ConversationReadRepo
