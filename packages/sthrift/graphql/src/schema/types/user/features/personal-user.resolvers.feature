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

	Scenario: Fetching all users with admin permission
		Given a verified admin user with "canViewAllUsers" permission
		And pagination parameters page 1 and pageSize 10
		When I execute the query "allUsers"
		Then it should call "User.PersonalUser.getAllUsers" with pagination parameters
		And return a list of all personal users

	Scenario: Fetching all users without authentication
		Given no authenticated user context
		When I execute the query "allUsers"
		Then it should throw an error "Unauthorized: Authentication required"

	Scenario: Fetching all users without admin permission
		Given a verified personal user without admin role
		When I execute the query "allUsers"
		Then it should throw an error "Forbidden: Only admins with canViewAllUsers permission can access this query"

	Scenario: Fetching all users as admin without canViewAllUsers permission
		Given a verified admin user without "canViewAllUsers" permission
		When I execute the query "allUsers"
		Then it should throw an error "Forbidden: Only admins with canViewAllUsers permission can access this query"

	Scenario: Updating personal user without authentication
		Given no authenticated user context
		When I execute the mutation "personalUserUpdate"
		Then it should throw an error "Unauthorized"

	Scenario: Blocking user without authentication
		Given no authenticated user context
		When I execute the mutation "blockUser"
		Then it should throw an error "Unauthorized"

	Scenario: Unblocking user without authentication
		Given no authenticated user context
		When I execute the mutation "unblockUser"
		Then it should throw an error "Unauthorized"

	Scenario: Attempting to create personal user when logged in as admin
		Given a verified admin user with email "admin@example.com"
		When I execute the query "currentPersonalUserAndCreateIfNotExists"
		Then it should throw an error "Admin users cannot use this query. Use currentUser instead."

	Scenario: Creating personal user without authentication
		Given no authenticated user context
		When I execute the query "currentPersonalUserAndCreateIfNotExists"
		Then it should throw an error "Unauthorized"

	Scenario: Accessing PersonalUser account field
		Given a PersonalUser object with account information
		When I access the account field resolver
		Then it should return the account object

	Scenario: Accessing PersonalUser account field with null account
		Given a PersonalUser object with null account
		When I access the account field resolver
		Then it should return null

	Scenario: Checking if current viewer is admin via PersonalUser field
		Given a PersonalUser object
		And the current viewer is an admin user
		When I access the userIsAdmin field resolver
		Then it should return true

	Scenario: Checking if current viewer is not admin via PersonalUser field
		Given a PersonalUser object
		And the current viewer is not an admin user
		When I access the userIsAdmin field resolver
		Then it should return false