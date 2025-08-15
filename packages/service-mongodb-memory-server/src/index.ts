import { MongoMemoryServer } from 'mongodb-memory-server';
import {setupEnvironment} from "./setup-environment.js";

setupEnvironment();
console.log("Starting memory server on port ", process.env.port);
MongoMemoryServer.create({
        instance: {
            dbName: process.env.db_name,
            port:  Number(process.env.port),
        },
}).then(server => {
    console.log("Memory server started at ", server.getUri());
}).catch(err => {
    console.error("Error starting memory server: ", err);
}); 

