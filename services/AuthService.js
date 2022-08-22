import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { oAuth2Client } from "../index.js";

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/userinfo.profile", // get user info
  "https://www.googleapis.com/auth/userinfo.email", // get user email ID and if its verified or not
  ,
];

/**
 * Get code for new token after prompting for user authorization,
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
export async function authorize() {
  const authUrl = await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    // prompt: "consent",
  });
  return authUrl;
}
