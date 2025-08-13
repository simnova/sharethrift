import { MongoMemoryServer } from 'mongodb-memory-server';

MongoMemoryServer.create({
        instance: {
            dbName: process.env.MONGODB_MEMORY_SERVER_DBNAME,
            port: process.env.MONGODB_MEMORY_SERVER_PORT ? Number(process.env.MONGODB_MEMORY_SERVER_PORT) : undefined,
        },
});


  

