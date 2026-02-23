# @cellix/mock-messaging-server-seedwork

Seedwork library for the mock messaging server used in Sharethrift monorepo.

## Purpose

Provides an in-memory store and seeding utilities for mocking Twilio Conversations/Messages APIs in tests and local development.

## Usage

Import the store and seed utilities:

```ts
import { store, seedMockData } from '@cellix/mock-messaging-server-seedwork';

seedMockData();
// Use store API for test setup/teardown
```

## Exports
- `store`: In-memory store for conversations, messages, participants
- `seedMockData()`: Seeds the store with sample data
- Types: `Conversation`, `Message`, `Participant`, etc.

## File Structure
- `src/store.ts`: Store implementation
- `src/seed-data.ts`: Data seeding logic
- `src/types.ts`: Type definitions

## License
MIT
