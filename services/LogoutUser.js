import { google } from "googleapis";
import { oAuth2Client } from "../index.js";

oAuth2Client
  .revokeToken
  //   oAuth2Client.credentials.access_token,
  //   function (err, body) {
  //     if (err) {
  //       console.log("error while lgoout is", err);
  //     } else {
  //       console.log("response of revoke token is", body);
  //     }
  //   }
  ();

//https://developers.google.com/identity/protocols/oauth2/web-server#node.js_8
//https://stackoverflow.com/questions/44781211/how-to-revoke-token-provided-by-oauth-from-google-nodejs
