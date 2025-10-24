# @cellix/mock-mongodb-memory-server

MongoDB Memory Server service for CellixJS monorepo with automatic mock data seeding.

## Overview

This package provides a MongoDB Memory Server for development and testing, automatically seeding the database with consistent mock data including users and item listings. This ensures all mock data is connected and follows the same structure across the application.

## Usage

### Basic Usage

```bash
ts-node src/index.ts
```

### Environment Variables

- `PORT` - MongoDB port (default: 50000)
- `DB_NAME` - Database name (default: 'test')
- `REPL_SET_NAME` - Replica set name (default: 'rs0')
- `SEED_MOCK_DATA` - Whether to seed mock data (default: true, set to 'false' to disable)

### Example with Custom Configuration

```bash
PORT=27017 DB_NAME=sharethrift_dev SEED_MOCK_DATA=true ts-node src/index.ts
```

## Mock Data

The service automatically seeds the following collections:

### Users Collection
- 5 mock users with complete profiles
- Connected account information
- Proper role and permission structures
- Consistent location data

### Item Listings Collection
- 6 mock item listings across various categories
- Connected to existing users via `sharer` field
- Diverse categories: Vehicles, Tools & Equipment, Home & Garden, Electronics, Clothing
- Multiple locations: Philadelphia, Seattle, Portland, Vancouver
- Proper sharing periods and states

## Data Structure

All mock data follows the ShareThrift domain model:
- Users include complete account profiles with billing information
- Item listings reference users via MongoDB ObjectId
- All entities include proper timestamps and schema versions
- Data is consistent and interconnected

## API

- `MongoDbMemoryService.start(): Promise<string>` - Starts the in-memory server and returns the connection URI.
- `MongoDbMemoryService.stop(): Promise<void>` - Stops the server.
- `MongoDbMemoryService.getInstance(): MongoMemoryServer | null` - Returns the current server instance.
- `seedMockData(connectionUri: string, dbName: string): Promise<void>` - Seeds the database with mock data.

## Integration

This service is designed to work with:
- ShareThrift API services that need consistent mock data
- Cognitive Search implementations that query from the database
- GraphQL resolvers that need connected, realistic data
- Development environments requiring predictable test data

## License
MIT
