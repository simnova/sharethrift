# Conversations Bounded Context

This bounded context handles in-app messaging functionality using Twilio Conversations API.

## Domain Structure

### Aggregates

- **Conversation**: Represents a conversation between users related to a specific listing
  - `twilioConversationSid`: Maps to Twilio Conversation resource
  - `listingId`: Associates conversation with a specific listing
  - `participants`: Array of user IDs who can send/receive messages
  - `createdAt/updatedAt`: Timestamp tracking

- **Message**: Represents individual messages within conversations
  - `twilioMessageSid`: Maps to Twilio Message resource
  - `conversationId`: Links message to parent conversation
  - `authorId`: User who sent the message
  - `content`: Message text content
  - `createdAt`: When message was sent

### Value Objects

- `TwilioConversationSid`: Validates Twilio Conversation SID format (CH + 32 chars)
- `TwilioParticipantSid`: Validates Twilio Participant SID format (MB + 32 chars)  
- `TwilioMessageSid`: Validates Twilio Message SID format (IM + 32 chars)
- `MessageContent`: Validates message content (1-1600 characters)
- `UserId`: References application users
- `ListingId`: References application listings

### Unit of Work Pattern

The `ConversationUnitOfWork` provides repositories for:
- `ConversationRepository`: CRUD operations for conversations
- `MessageRepository`: CRUD operations for messages

## Integration Points

- **Twilio Conversations API**: For real-time messaging capabilities
- **User Management**: Via UserId references to application users
- **Listings**: Via ListingId references to listing entities
- **Authentication**: Ensures only conversation participants can access messages

## Business Rules

1. Conversations are scoped to specific listings
2. Only conversation participants can view or send messages
3. Each user pair can have only one conversation per listing
4. Messages are ordered chronologically within conversations
5. Conversation activity updates the `updatedAt` timestamp