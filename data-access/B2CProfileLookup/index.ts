import express, { Router } from 'express';
import passport from "passport";
import { BasicStrategy } from "passport-http";
import { createHandler } from "azure-function-express";
import { b2cRequestBody, conflictError } from "./interfaces";

//Credentials used for validating api calls
const b2cUsername = process.env.B2C_HTTP_USERNAME ?? "missing-username"; //TODO: to be populated from Key Vault
const b2cPassword = process.env.B2C_HTTP_PASSWORD ?? "missing-password"; //TODO: to be populated from Key Vault

const app: express.Application = express();
const router = Router();

app.use(passport.initialize());

passport.use(
  new BasicStrategy(function (username, password, done) {
    if (username === b2cUsername && password === b2cPassword) {
      return done(null, true);
    }
    return done(null, false);
  })
);

router.route("/health").get((_req, res) => {
  console.log('Health check');
  return res.status(200).json({ status: "healthy" });
});

router.route("/logIn").post(async (req, res) => {
    try {
      if (req.body) {
        //let b2cRequestBody = <b2cRequestBody>req.body;
        //var profile = await GetUserProfile(b2cRequestBody.oid);
        var profile = {emswpUserPermissions: [{
            o_id: req.body.oid,
            schoolId: 1453,
            roles: ["ACE_ADMIN_SV"]
          }]
        }

        /*
      EMSWP roles for Authority Portal =
      ACE_ADMIN
      USER_SV
      ADMIN_SV
      ACE_ADMIN_SV
      ACE_ADMIN_DIVA
      ADMIN_DIVA
      USER_DIVA
      */

        // profile = {emswpUserPermissions: [{
        //    schoolId: 1453,
        //    roles: ["ACE_ADMIN_SV"]
        //  }]
        // }
        return res.status(200).json({ bodyData: JSON.stringify(profile) });
      } else {
        return res
          .status(200)
          .json({ bodyData: "ERROR - Request body from B2C is empty" });
      }
    } catch (error) {
      var unauthMessage = {
        version: "1.0.1",
        status: 409,
        userMessage:
          `Error obtaining profile data. ${error}`,
      } as conflictError;

      return res.status(409).json(unauthMessage);
    }
  }
);

router.route("/validateUsername").post((req, res) => {
  const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var isEmailAddress = emailRegex.test(req.body["signInNames.userName"]);

  if (isEmailAddress) {
    var unauthMessage = {
      version: "1.0.1",
      status: 409,
      userMessage:
        "The username or password provided in the request is invalid.",
    } as conflictError;

    return res.status(409).json(unauthMessage);
  }

  return res.status(200);
});

app.use("/api/B2CProfileLookup", router);

module.exports = createHandler(app);