import mongoose from 'mongoose';

async function connect() {
    mongoose.set('useCreateIndex', true); //Prevents deprecation warning
    if(!process.env.COSMOSDB || process.env.COSMOSDB.length === 0) throw new Error("CosmosDB connection string not found.");
    if(!process.env.COSMOSDB_DBNAME || process.env.COSMOSDB_DBNAME.length === 0) throw new Error("CosmosDB name not found.");
    try {
        await mongoose.connect(`${process.env.COSMOSDB}&retrywrites=false`, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false,
            tlsInsecure: process.env.NODE_ENV === "development", //only true for local developent - required for Azure Cosmos DB emulator
            dbName: process.env.COSMOSDB_DBNAME,
            poolSize: Number(process.env.COSMOSDB_POOL_SIZE)
        }).then(() => console.log(`🗄️ Successfully connected Mongoose to ${mongoose.connection.name} 🗄️`));

        if(process.env.NODE_ENV === "development"){
            mongoose.set('debug', {shell: true});
        }
    } catch (error) {
        console.log(`🔥 An error ocurred when trying to connect Mongoose with ${mongoose.connection.name} 🔥`)
        throw error;
    }
}

export default connect;