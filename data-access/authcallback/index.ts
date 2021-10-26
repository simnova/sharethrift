import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");


  
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

  if (!(req.body && req.body.email && req.body.email.includes("@"))) {
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
  const allowedDomains = ["fabrikam.com", "farbicam.com","simnova.com"];

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
  return;

//   const name = req.query.name || (req.body && req.body.name);
//   const responseMessage = name
//     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

//   context.res = {
//     // status: 200, /* Defaults to 200 */
//     body: responseMessage,
//   };
};

export default httpTrigger;
