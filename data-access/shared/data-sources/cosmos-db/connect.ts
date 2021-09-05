import mongoose from 'mongoose';

async function connect() {
    if(!process.env.COSMOSDB || process.env.COSMOSDB.length === 0) throw new Error("CosmosDB connection string not found.");
    try {
        await mongoose.connect(process.env.COSMOSDB, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false,
            poolSize: Number(process.env.COSMOSDB_POOL_SIZE)
        }).then(() => console.log(`🗄️ Successfully connected Mongoose to ${mongoose.connection.name} 🗄️`));
    } catch (error) {
        console.log(`🔥 An error ocurred when trying to connect Mongoose with ${mongoose.connection.name} 🔥`)
        throw error;
    }
}

export default connect;