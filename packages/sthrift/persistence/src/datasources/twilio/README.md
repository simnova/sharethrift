# Twilio DataSource

Domain-oriented interface for accessing Twilio Conversations through the persistence layer.

## Purpose

Provides repositories that fetch Twilio data via `IMessagingService` and map responses to domain entities.

## Structure

```typescript
interface TwilioDataSource {
  Conversation: {
    Conversation: {
      TwilioConversationRepo: TwilioConversationRepository;
    };
  };
}

interface TwilioConversationRepository {
  listConversations(): Promise<ConversationDomain[]>;
  getConversationBySid(conversationSid: string): Promise<ConversationDomain>;
  createConversation(friendlyName: string): Promise<ConversationDomain>;
  updateConversation(conversationSid: string, friendlyName: string): Promise<ConversationDomain>;
  deleteConversation(conversationSid: string): Promise<void>;
}
```

## Integration

```typescript
import { TwilioDataSourceImplementation } from './twilio';
import type { IMessagingService } from '@cellix/messaging';

export type DataSources = {
  domainDataSource: DomainDataSource;
  readonlyDataSource: ReadonlyDataSource;
  twilioDataSource?: TwilioDataSource;  // Optional
};

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
  const withPassport = (passport: Domain.Passport, messagingService?: IMessagingService): DataSources => {
    const dataSources: DataSources = {
      domainDataSource: DomainDataSourceImplementation(models, passport),
      readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
    };

    if (messagingService) {
      dataSources.twilioDataSource = TwilioDataSourceImplementation(messagingService, passport);
    }

    return dataSources;
  };
};
```

## Usage

```typescript
import { Persistence } from '@sthrift/persistence';
import { ServiceTwilioMock } from '@sthrift/mock-service-twilio';

const mockService = new ServiceTwilioMock('http://localhost:10000');
await mockService.startUp();

const dataSources = Persistence(mongooseService).withPassport(passport, mockService);

const conversations = await dataSources.twilioDataSource
  ?.Conversation.Conversation.TwilioConversationRepo.listConversations();
```

## In GraphQL Resolvers

```typescript
export const conversationResolvers = {
  Query: {
    twilioConversations: async (_parent, _args, { dataSources }) => {
      return dataSources.twilioDataSource
        ?.Conversation.Conversation.TwilioConversationRepo.listConversations();
    },
  },
};
```
