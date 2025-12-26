# @cellix/mock-mongodb-memory-server

MongoDB Memory Server service for development and testing with automatic mock data seeding.

## Usage

```bash
ts-node src/index.ts
```

### Environment Variables

- `PORT` - MongoDB port (default: 50000)
- `DB_NAME` - Database name (default: 'test')
- `REPL_SET_NAME` - Replica set name (default: 'rs0')
- `SEED_MOCK_DATA` - Whether to seed mock data (default: true, set to 'false' to disable)

### Example

```bash
PORT=27017 DB_NAME=sharethrift_dev SEED_MOCK_DATA=true ts-node src/index.ts
```

## Mock Data

Automatically seeds test database with:

- Mock users with complete profiles and account information
- Item listings connected to users across various categories and locations
- Consistent data following ShareThrift domain model


## API

- `MongoDbMemoryService.start(): Promise<string>` - Starts server and returns connection URI
- `MongoDbMemoryService.stop(): Promise<void>` - Stops server
- `MongoDbMemoryService.getInstance(): MongoMemoryServer | null` - Returns server instance
- `seedMockData(connectionUri: string, dbName: string): Promise<void>` - Seeds mock data

## License

MIT

