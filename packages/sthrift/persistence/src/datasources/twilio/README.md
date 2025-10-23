# Persistence Layer - Twilio DataSource

This folder contains the **Twilio DataSource**, a persistence layer component that integrates Twilio's Conversations API into the ShareThrift application's Domain-Driven Design architecture.

## 📂 Location

```
packages/sthrift/persistence/src/datasources/twilio/
```

## 🎯 Purpose

The Twilio DataSource provides a clean, domain-oriented interface for interacting with Twilio conversations. It:

- ✅ Fetches data from Twilio (mock or real) via `ServiceTwilio`
- ✅ Converts Twilio API responses into domain entities
- ✅ Follows the same structure as `domain` and `readonly` datasources
- ✅ Supports dependency injection for testing and flexibility
- ✅ Provides type-safe repository methods

## 🏗️ Architecture

The Twilio DataSource follows a **three-layer architecture**:

```
┌─────────────────────────────────────────────────────────┐
│  Application Layer (GraphQL Resolvers, Azure Functions) │
│  Calls: dataSources.twilioDataSource.Conversation...    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  PERSISTENCE LAYER - Twilio DataSource                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Repository Layer (twilio-conversation.repo.ts) │   │
│  │  Methods: getConversationBySid(),               │   │
│  │           sendMessage(), createConversation()   │   │
│  └───────────────────┬─────────────────────────────┘   │
│                      │                                  │
│  ┌───────────────────▼─────────────────────────────┐   │
│  │  Adapter Layer (twilio-conversation.adapter.ts) │   │
│  │  Converts: Twilio API → Domain Entities         │   │
│  └───────────────────┬─────────────────────────────┘   │
│                      │                                  │
│  ┌───────────────────▼─────────────────────────────┐   │
│  │  Types Layer (twilio-conversation.types.ts)     │   │
│  │  Defines: Twilio API response interfaces        │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  SERVICE LAYER (@sthrift/service-twilio)                │
│  Routes to: Mock Server OR Real Twilio                  │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   TWILIO_USE_MOCK?  │
          └──────────┬──────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼──────┐        ┌──────▼──────┐
    │ Mock      │        │ Real Twilio │
    │ Server    │        │ API         │
    │ :3004     │        │ (Cloud)     │
    └───────────┘        └─────────────┘
```

## 📁 Folder Structure

```
twilio/
├── index.ts                              # Main datasource factory
└── conversation/
    ├── index.ts                          # Conversation context factory
    └── conversation/
        ├── index.ts                      # Repository factory
        ├── twilio-conversation.types.ts     # Twilio API response types
        ├── twilio-conversation.domain-adapter.ts  # Twilio → Domain conversion
        └── twilio-conversation.repository.ts      # Repository implementation
```

### File Breakdown

#### `twilio/index.ts` - Main DataSource Factory

Exports `TwilioDataSource` interface and `TwilioDataSourceImplementation` factory.

```typescript
export interface TwilioDataSource {
  Conversation: {
    Conversation: {
      TwilioConversationRepo: TwilioConversationRepository;
    };
  };
}

export const TwilioDataSourceImplementation = (
  twilioService: ServiceTwilio,
  passport: Domain.Passport,
): TwilioDataSource => ({
  Conversation: TwilioConversationContext(twilioService, passport),
});
```

#### `conversation/conversation/twilio-conversation.types.ts` - Type Definitions

Defines TypeScript interfaces matching Twilio's API response structure:

- `TwilioConversationResponse` - Conversation data from Twilio
- `TwilioMessageResponse` - Message data from Twilio
- `TwilioParticipantResponse` - Participant data from Twilio
- Paginated list responses

#### `conversation/conversation/twilio-conversation.domain-adapter.ts` - Adapter

Converts Twilio API format to domain entity format:

```typescript
export class TwilioConversationDomainAdapter {
  static toDomainConversationProps(twilioConversation: TwilioConversationResponse, ...): ConversationProps;
  static toDomainMessage(twilioMessage: TwilioMessageResponse, ...): Message;
  static toDomainMessages(twilioMessages: TwilioMessageResponse[], ...): Message[];
}
```

#### `conversation/conversation/twilio-conversation.repository.ts` - Repository

Provides methods to interact with Twilio and return domain entities:

```typescript
export interface TwilioConversationRepository {
  getConversationBySid(twilioSid: string): Promise<ConversationEntityReference | null>;
  listConversations(): Promise<ConversationEntityReference[]>;
  sendMessage(twilioConversationSid: string, body: string, author: string): Promise<MessageEntityReference>;
  deleteConversation(twilioSid: string): Promise<void>;
  createConversation(friendlyName?: string, uniqueName?: string): Promise<ConversationEntityReference>;
}
```

## 🚀 Usage

### Integration in Persistence Layer

The Twilio datasource is integrated at the top level in `datasources/index.ts`:

```typescript
import { TwilioDataSourceImplementation } from './twilio/index.ts';

export type DataSources = {
  domainDataSource: DomainDataSource;
  readonlyDataSource: ReadonlyDataSource;
  twilioDataSource?: TwilioDataSource;  // Optional
};

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
  const withPassport = (passport: Domain.Passport, twilioService?: ServiceTwilio): DataSources => {
    const dataSources: DataSources = {
      domainDataSource: DomainDataSourceImplementation(models, passport),
      readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
    };

    // Only include twilioDataSource if twilioService is provided
    if (twilioService) {
      dataSources.twilioDataSource = TwilioDataSourceImplementation(twilioService, passport);
    }

    return dataSources;
  };

  // ...
};
```

### Basic Usage Example

```typescript
import { Persistence } from '@sthrift/persistence';
import { ServiceTwilio } from '@sthrift/service-twilio';

// Configure to use mock server (or omit for real Twilio)
process.env.TWILIO_USE_MOCK = 'true';

// Create and start Twilio service
const twilioService = new ServiceTwilio();
await twilioService.startUp();

// Create persistence with Twilio datasource
const persistenceFactory = Persistence(mongooseService);
const dataSources = persistenceFactory.withPassport(userPassport, twilioService);

// Access Twilio datasource
const conversation = await dataSources.twilioDataSource
  ?.Conversation
  .Conversation
  .TwilioConversationRepo
  .getConversationBySid('CH123abc');

console.log(conversation?.friendlyName);
// Output: "MacBook Pro 2021 Rental Discussion"
```

### GraphQL Resolver Example

```typescript
import type { Resolvers } from '../generated/graphql.js';

export const conversationResolvers: Resolvers = {
  Query: {
    twilioConversation: async (_, { sid }, { dataSources }) => {
      // Check if Twilio datasource is available
      if (!dataSources.twilioDataSource) {
        throw new Error('Twilio datasource not configured');
      }

      // Fetch conversation from Twilio (mock or real)
      const conversation = await dataSources.twilioDataSource
        .Conversation
        .Conversation
        .TwilioConversationRepo
        .getConversationBySid(sid);

      if (!conversation) {
        throw new Error(`Conversation ${sid} not found`);
      }

      return {
        id: conversation.id,
        friendlyName: conversation.friendlyName,
        // ... map to GraphQL type
      };
    },
  },
  Mutation: {
    sendTwilioMessage: async (_, { conversationSid, body, author }, { dataSources }) => {
      const message = await dataSources.twilioDataSource
        ?.Conversation
        .Conversation
        .TwilioConversationRepo
        .sendMessage(conversationSid, body, author);

      return {
        id: message.id,
        body: message.body.value,
        // ... map to GraphQL type
      };
    },
  },
};
```

### Testing Example

```typescript
import { describe, it, beforeEach, afterAll } from 'vitest';
import { MockTwilioServer } from '@sthrift/mock-twilio-server';
import { ServiceTwilio } from '@sthrift/service-twilio';
import { Persistence } from '@sthrift/persistence';

describe('Twilio Datasource Integration Tests', () => {
  let mockServer: MockTwilioServer;
  let twilioService: ServiceTwilio;
  let dataSources: DataSources;

  beforeEach(async () => {
    // Start mock server
    process.env.TWILIO_USE_MOCK = 'true';
    mockServer = new MockTwilioServer();
    await mockServer.startUp();

    // Create Twilio service
    twilioService = new ServiceTwilio();
    await twilioService.startUp();

    // Create persistence with Twilio datasource
    const persistenceFactory = Persistence(mongooseService);
    dataSources = persistenceFactory.withSystemPassport(twilioService);
  });

  afterAll(async () => {
    await twilioService.shutDown();
    await mockServer.shutDown();
  });

  it('should fetch conversation from Twilio and convert to domain entity', async () => {
    const conversation = await dataSources.twilioDataSource
      ?.Conversation
      .Conversation
      .TwilioConversationRepo
      .getConversationBySid('CH123abc');

    expect(conversation).toBeDefined();
    expect(conversation?.id).toBe('CH123abc');
    expect(conversation?.friendlyName).toBe('MacBook Pro 2021 Rental Discussion');
  });

  it('should send message and return domain entity', async () => {
    const message = await dataSources.twilioDataSource
      ?.Conversation
      .Conversation
      .TwilioConversationRepo
      .sendMessage('CH123abc', 'Test message', 'test@example.com');

    expect(message).toBeDefined();
    expect(message.body.value).toBe('Test message');
  });

  it('should list all conversations', async () => {
    const conversations = await dataSources.twilioDataSource
      ?.Conversation
      .Conversation
      .TwilioConversationRepo
      .listConversations();

    expect(conversations).toHaveLength(3); // Seeded data
  });
});
```

## 🔄 Data Flow

### Example: Fetching a Conversation

```
1. Application Layer
   ├─ GraphQL Resolver / Azure Function
   └─ Calls: dataSources.twilioDataSource.Conversation.Conversation.TwilioConversationRepo.getConversationBySid('CH123abc')
        │
2. Repository Layer (twilio-conversation.repository.ts)
   ├─ Receives: twilioSid = 'CH123abc'
   ├─ Calls: this.twilioService.getConversation('CH123abc')
   └─ Returns: Twilio API response (TwilioConversationResponse)
        │
3. Service Layer (@sthrift/service-twilio)
   ├─ Checks: TWILIO_USE_MOCK environment variable
   ├─ Routes to: Mock Server (http://localhost:3004) OR Real Twilio API
   └─ Returns: JSON response from Twilio
        │
4. Repository Layer (continued)
   ├─ Creates stub entities: sharer, reserver, listing (TODO: fetch from DB)
   ├─ Calls: TwilioConversationDomainAdapter.toDomainConversationProps(...)
   └─ Returns: Domain entity (Conversation)
        │
5. Adapter Layer (twilio-conversation.domain-adapter.ts)
   ├─ Receives: TwilioConversationResponse
   ├─ Converts:
   │   - sid → id
   │   - date_created (ISO string) → createdAt (Date object)
   │   - friendly_name → friendlyName
   └─ Returns: ConversationProps
        │
6. Repository Layer (final)
   ├─ Creates: new Conversation(conversationProps, passport)
   └─ Returns: ConversationEntityReference (domain entity)
        │
7. Application Layer (final)
   └─ Receives: Type-safe domain entity with domain methods
```

## 🌐 Mock vs. Real Twilio

The datasource works identically with both mock and real Twilio:

### Using Mock Server (Development/Testing)

```typescript
process.env.TWILIO_USE_MOCK = 'true';

// Start mock server
const mockServer = new MockTwilioServer();
await mockServer.startUp();

// ServiceTwilio automatically routes to http://localhost:3004
const twilioService = new ServiceTwilio();
await twilioService.startUp();

// Use datasource - calls mock server
const dataSources = persistenceFactory.withPassport(passport, twilioService);
```

### Using Real Twilio (Production)

```typescript
process.env.TWILIO_USE_MOCK = 'false';
process.env.TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxx';
process.env.TWILIO_AUTH_TOKEN = 'your_auth_token';

// ServiceTwilio routes to real Twilio API
const twilioService = new ServiceTwilio();
await twilioService.startUp();

// Use datasource - calls real Twilio
const dataSources = persistenceFactory.withPassport(passport, twilioService);
```

## 🔑 Key Design Patterns

### 1. Repository Pattern

**Location:** `twilio-conversation.repository.ts`

Provides a collection-like interface for accessing data:

```typescript
class TwilioConversationRepositoryImpl implements TwilioConversationRepository {
  async getConversationBySid(twilioSid: string): Promise<ConversationEntityReference | null> {
    // Hides complexity of calling ServiceTwilio + converting to domain entity
  }
}
```

### 2. Adapter Pattern

**Location:** `twilio-conversation.domain-adapter.ts`

Converts one interface to another (Twilio API → Domain):

```typescript
class TwilioConversationDomainAdapter {
  static toDomainMessage(twilioMessage: TwilioMessageResponse): Message {
    // Converts Twilio format to domain format
  }
}
```

### 3. Factory Pattern

**Location:** Multiple `index.ts` files

Creates complex objects without exposing construction logic:

```typescript
export const TwilioConversationContext = (
  twilioService: ServiceTwilio,
  passport: Domain.Passport,
) => ({
  Conversation: TwilioConversationRepositoryImpl(twilioService, passport),
});
```

### 4. Dependency Injection

**Location:** Repository constructor

Dependencies (like `ServiceTwilio`) are passed from outside:

```typescript
class TwilioConversationRepositoryImpl {
  constructor(
    private twilioService: ServiceTwilio,  // Injected dependency
    private passport: Domain.Passport
  ) {}
}
```

## 🚧 TODOs

The repository currently uses **stub entities** for related data. These should be replaced with actual database lookups:

1. **User Lookups** - Replace `createStubUser()` with actual user repository calls
2. **Listing Lookups** - Replace `createStubListing()` with actual listing repository calls
3. **Author ID Mapping** - Map Twilio author emails to real user ObjectIds

Example improvement:

```typescript
// Current (stub)
private createStubUser(userId: string): PersonalUserEntityReference {
  return { id: userId } as unknown as PersonalUserEntityReference;
}

// Future (real database lookup)
private async getUser(userId: string): Promise<PersonalUserEntityReference> {
  return await this.dataSources.readonlyDataSource
    .User
    .PersonalUser
    .PersonalUserReadRepo
    .getPersonalUserById(userId);
}
```

## 🤝 Contributing

When extending the Twilio datasource:

1. **Add new methods** to `TwilioConversationRepository` interface
2. **Implement in repository** class (`TwilioConversationRepositoryImpl`)
3. **Use adapter** for type conversions (`TwilioConversationDomainAdapter`)
4. **Add tests** to verify behavior with mock server
5. **Update this README** with new usage examples
