import express, { Router } from 'express';
import passport from "passport";
import { BasicStrategy } from "passport-http";
import { createHandler } from "azure-function-express";
import { b2cRequestBody, conflictError } from "./interfaces";
import jwt, { Secret } from "jsonwebtoken";

import IdTokenHintBuilder from './infrastructure/IdTokenHintBuilder';
import TokenSigningCertificateManager from './infrastructure/TokenSigningCertificateManager';

//Credentials used for validating api calls
const b2cUsername = process.env.B2C_HTTP_USERNAME ?? "missing-username"; //TODO: to be populated from Key Vault
const b2cPassword = process.env.B2C_HTTP_PASSWORD ?? "missing-password"; //TODO: to be populated from Key Vault

const app: express.Application = express();
const router = Router();

const placeHolder = new TokenSigningCertificateManager(magicLinkCallBack);
const idTokenHintBuilder = new IdTokenHintBuilder(placeHolder);

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

  return res.status(200).json({ message: "Username successfully validated" });
});

router.route("/invite").post((req, res) => {
  console.log('invite');

  //is the body empty?
  if (req.body === null || req.body === undefined) {
    return b2cErrorResponse('Request content is empty');
  } else {
    console.log('Full Resquest Body', req.body);
    idTokenHintBuilder.buildIdToken('iwilson@ecfmg.org');
  }

  var email = req.body["email"];

  //is the email address valid?
  if (email === null || email === undefined) {
    return b2cErrorResponse('Email address is empty');
  }

  return res.status(200).json({ message: "Invite successfully sent" });
});

function b2cErrorResponse(message) {
  var errorResponse = {
    version: "1.0.1",
    status: 409,
    userMessage: `${message}`
  } as conflictError;

  return errorResponse;
}

function magicLinkCallBack(err, cert) {
  if (err) {
    console.log('magicLinkCallBack', err);
  }
  if (cert) {
    const audience = process.env.B2C_MAGIC_LINK_AUDIENCE ?? "";
console.log('AUD', audience);
    var token = jwt.sign(
      { email: 'iwilson@ecfmg.org' },
      cert.key as Secret,
      {
        algorithm: 'RS256',
        issuer: process.env.B2C_MAGIC_LINK_ISSUER as string,
        audience: audience,
        expiresIn: '1h',
      }
    )
    //https://msalb2ctestenvironment.b2clogin.com/msalb2ctestenvironment.onmicrosoft.com/B2C_1A_SIGNIN_WITH_MAGIC_LINK/oauth2/v2.0/authorize?client_id=475da981-269a-4405-81ea-3fc6d96d12c9&nonce=0f8fad5b-d9cb-469f-a165-70867728950e&redirect_uri=https%3a%2f%2fjwt.ms&scope=openid&response_type=id_token

    console.log('URL', `https://msalb2ctestenvironment.b2clogin.com/msalb2ctestenvironment.onmicrosoft.com/B2C_1A_SIGNIN_WITH_MAGIC_LINK/oauth2/v2.0/authorize?client_id=475da981-269a-4405-81ea-3fc6d96d12c9&nonce=0f8fad5b-d9cb-469f-a165-70867728950e&redirect_uri=https%3a%2f%2fjwt.ms&scope=openid&response_type=id_token&id_token_hint=${token}`);
    console.log('URL', `${process.env.B2C_MAGIC_LINK_REDIRECT_URL}?id_token_hint=${token}`);

    console.log('magicLinkCallBack-TOKEN', token);
  }
}

app.use("/api/B2CProfileLookup", router);

module.exports = createHandler(app);