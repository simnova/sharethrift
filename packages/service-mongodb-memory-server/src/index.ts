import { MongoMemoryServer } from 'mongodb-memory-server';


console.log("Starting memory server on port ", 50000);
MongoMemoryServer.create({
        instance: {
            dbName: "sharethrift",
            port: 50000
        },
}).then(server => {
    console.log("Memory server started at ", server.getUri());
}).catch(err => {
    console.error("Error starting memory server: ", err);
}); 

