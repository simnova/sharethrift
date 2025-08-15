# User Bounded Context

## Purpose
The User bounded context manages user accounts, profiles, and identity within the ShareThrift platform. It supports different user types including Personal and Admin users with various account tiers and permissions.

## Key Domain Concepts

### User Types
- **Personal User**: Regular users who can share and reserve items
  - Non-Verified Personal: Basic account with limited features
  - Verified Personal: ID-verified account with expanded features  
  - Verified Personal Plus: Premium account with maximum features
- **Admin User**: Platform administrators with management capabilities

### Core Entities
- **User**: Aggregate root containing account and profile information
- **Account**: Login credentials and account type settings
- **Profile**: Personal information, location, and billing details

## Business Rules
- Each email/username combination must be unique
- User type determines available features and limits
- Profile information varies by account type
- Personal users can be blocked by admins
- Account type cannot be changed after creation (username restriction)

## Authorization Requirements
- Users can view and edit their own profiles
- Admins can view all user profiles and perform moderation actions
- Profile owners have access to additional information (friends, billing, etc.)
- Public viewers see limited profile information

## Events
- UserCreated: When a new user account is created
- UserProfileUpdated: When profile information changes
- UserBlocked/Unblocked: When user status changes