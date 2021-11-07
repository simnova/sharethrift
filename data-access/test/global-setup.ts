import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from './config';


const globalSetup = async () => {
  console.log('globalSetup');
  if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite

    const instance = await MongoMemoryReplSet.create({ replSet: { count: 4, storageEngine: 'wiredTiger'} }); // WiredTiger and replicaset are required for transactions
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    process.env.COSMOSDB = uri.slice(0, uri.lastIndexOf('/'));
    console.log('CosmosDB Memory');
  } else {
    process.env.COSMOSDB = `mongodb://${config.IP}:${config.Port}`;
    console.log('CosmosDB REgular');
  }

  // The following is to make sure the database is clean before a test starts
  var connectionString = `${process.env.COSMOSDB}/${process.env.COSMOSDB_DBNAME}&ssl=true&retrywrites=false`;
  console.log(`memory connectionString: ${connectionString}`);
  await mongoose.connect(
    connectionString, 
    { 
      useUnifiedTopology: true,
      tlsInsecure: process.env.NODE_ENV === "development", //only true for local developent - required for Azure Cosmos DB emulator
      dbName: process.env.COSMOSDB_DBNAME,
      keepAlive: true, 
      keepAliveInitialDelay: 300000
    } as mongoose.ConnectOptions
  );
  console.log(`🗄️ Successfully connected Mongoose to ${mongoose.connection.name} 🗄️`)
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
};

export default globalSetup;