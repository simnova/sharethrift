Feature: Personal User Management and Payment Operations
The Personal User resolvers handle user queries, updates, and payment processing.

	Background:
		Given a verified JWT user context exists
		And the GraphContext is initialized with User and Payment application services

	Scenario: Fetching a personal user by ID
		Given a valid user ID "user-123"
		When I execute the query "personalUserById"
		Then the resolver should call "User.PersonalUser.queryById" with id "user-123"
		And it should return the corresponding PersonalUser object

	Scenario: Creating or fetching the current personal user
		Given a verified user with email "john.doe@example.com"
		When I execute the query "currentPersonalUserAndCreateIfNotExists"
		Then the resolver should call "User.PersonalUser.createIfNotExists"
		And it should return the existing or newly created PersonalUser entity

	Scenario: Fetching all users with filters and pagination
		Given the admin requests all users with page "1" and pageSize "20"
		When I execute the query "allUsers"
		Then the resolver should call "User.PersonalUser.getAllUsers"
		And return a paginated list of users matching the filters

	Scenario: Updating personal user information
		Given a valid user update input with id "user-123" and new name "Alice"
		When I execute the mutation "personalUserUpdate"
		Then the resolver should call "User.PersonalUser.update"
		And it should update the record and return the updated user

	Scenario: Blocking a user
		Given a valid userId "user-456"
		When I execute the mutation "blockUser"
		Then the resolver should call "User.PersonalUser.update" with "isBlocked" set to true
		And the user should be marked as blocked

	Scenario: Unblocking a user
		Given a valid userId "user-456"
		When I execute the mutation "unblockUser"
		Then the resolver should call "User.PersonalUser.update" with "isBlocked" set to false
		And the user should be unblocked successfully

	Scenario: Processing a payment successfully
		Given a valid payment request with order and billing information
		When I execute the mutation "processPayment"
		Then it should call "Payment.processPayment" with sanitized fields
		And return a PaymentResponse with status "SUCCEEDED" and success true

	Scenario: Handling payment processing failure
		Given a payment request that causes an error
		When I execute the mutation "processPayment"
		Then it should return a PaymentResponse with status "FAILED"
		And include errorInformation with reason "PROCESSING_ERROR"

	Scenario: Refunding a successful payment
		Given a valid refund request with transactionId "txn-789" and amount "100.00"
		When I execute the mutation "refundPayment"
		Then it should call "Payment.refundPayment"
		And return a RefundResponse with status "REFUNDED" and success true

	Scenario: Handling refund failure
		Given a refund request that causes an error
		When I execute the mutation "refundPayment"
		Then it should return a RefundResponse with status "FAILED"
		And include errorInformation with reason "PROCESSING_ERROR"