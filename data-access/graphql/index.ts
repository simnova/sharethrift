import * as appInsights from "applicationinsights";

//let appInsights = import("applicationinsights");
appInsights.setup().start();
appInsights.defaultClient.commonProperties = {
  environment: process.env.WEBSITE_HOSTNAME,
  functionArea: "graphql",
};
let appInsightsClient = appInsights.defaultClient;

import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";

import { ApolloServer, gql } from "apollo-server-azure-functions";
import cosmosdbconnect from "../shared/data-sources/cosmos-db/connect";
import MsalAuth from "../shared/auth/msal";
import { HttpRequest, Context } from "@azure/functions";

import resolvers from "./resolvers/index";
import typeDefs from "./typedefs/index";
//import { execute } from "graphql";

//var x = await fetch('...');
/* IIFE for connecting to CosmosDB */
//(async () => {
var connectMongo = async () => {
  console.log("initialized");
  return;
  try {
    console.log("before cosmosConnect");
    await cosmosdbconnect();
    console.log("after cosmosConnect");
  } catch (cosmosDbConnectError) {
    appInsightsClient.trackEvent({
      name: "COSMOSDB CONNECTION",
      properties: {
        customProperty: "Cannot Connect to Cosmos",
        details: cosmosDbConnectError,
      },
    });
    appInsightsClient.trackException(cosmosDbConnectError);
  }
}

function enableConsoleLogging (context) {
  if (context) {
    const originalLogger = console.log;
    console.log = function () {
      context.log(...arguments);
      originalLogger(...arguments);
    };
  }
}
//})();


const getPlaygroundSetting = () => {
  if (process.env.APOLLO_PLAYGROUND_VISIBLE === "true") {
    if (process.env.APOLLO_PLAYGROUND_ENDPOINT) {
      return { endpoint: process.env.APOLLO_PLAYGROUND_ENDPOINT };
    }
    return true;
  } else {
    return false;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (request) => {
    var [user, validated] = await MsalAuth.VerifyAccessToken(request);
    return { user, validated };
  },
});

const graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

var initalized =false;


module.exports = async function  (context: Context, req: HttpRequest) {
/*
  if(!initalized){
    //enableConsoleLogging(context);
    await connectMongo();
    initalized = true;
  }
  */
  /*
  var authorization = req.headers["authorization"] || "";
  var token = authorization.split(/\s+/).pop() || ""; // and the encoded auth token
  var auth = Buffer.from(token, "base64").toString(); // convert from base64
  var parts = auth.split(/:/); // split on colon
  var username = parts[0];
  var password = parts[1];

  if (
    username !== process.env["BASIC_AUTH_USERNAME"] ||
    password !== process.env["BASIC_AUTH_PASSWORD"]
  ) {
    context.res = {
      status: 401,
    };
    context.log("Invalid Authentication");
    return;
  }

  // If input data is null, return error.
  const INVALID_REQUEST = {
    status: 400,
    body: {
      code: "INVALID_REQUEST",
    },
  };

  if (!(req.body && req.body.email && req.body.email.contains("@"))) {
    context.res = INVALID_REQUEST;
    context.log("Invalid Request");
    return;
  }

  // Log the request body
  context.log(`Request body: ${JSON.stringify(req.body)}`);

  // Get the current user language
  var language = req.body.ui_locales ? "default" : req.body.ui_locales;
  context.log(`User language: ${language}`);

  // get domain of email address
  const domain = req.body.email.split("@")[1];
  const allowedDomains = ["fabrikam.com", "farbicam.com"];

  // Check that the domain of the email is from a specific other tenant
  if (allowedDomains.includes(domain.toLowerCase())) {
    context.res = {
      body: {
        action: "ShowBlockPage",
        userMessage:
          "You must have an account from a valid domain to register as an external user for Contoso.",
        code: "SignUp-BlockByEmailDomain-0",
      },
    };
    context.log(context.res);
    return;
  }

  // Validate the 'Job Title', if provideed, to ensure it's at least 4 characters.
  if (req.body.jobTitle && req.body.jobTitle.length < 5) {
    //use !req.body.jobTitle to require jobTitle
    context.res = {
      status: 400,
      body: {
        action: "ValidationError",
        status: 400,
        userMessage: "Please provide a job title with at least 5 characters.",
        code: "SingUp-Input-Validation-0",
      },
    };
  }

  // Email domain and user collected attribute are valid, return continuation response.
  context.res = {
    body: { action: "Continue" },
  };

  context.log(context.res);
*/
  // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers["x-ms-privatelink-id"] = "";
  // apollo-server only reads this specific string
  req.headers["Access-Control-Request-Headers"] =
    req.headers["Access-Control-Request-Headers"] ||
    req.headers["access-control-request-headers"];
  return graphqlHandler(context, req);
};
