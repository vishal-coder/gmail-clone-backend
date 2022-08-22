//https://developers.google.com/identity/protocols/oauth2
//https://developers.google.com/identity/protocols/oauth2/web-server#node.js

//https://developers.google.com/gmail/api

//https://developers.google.com/gmail/api/reference/rest/ == all rest API

//https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users.html#getProfile == all code

//https://fusebit.io/blog/gmail-api-node-tutorial/?utm_source=www.google.com&utm_medium=referral&utm_campaign=none = code for some methods

import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/Authroute.js";

import { MongoClient } from "mongodb";
import cors from "cors";
import { google } from "googleapis";

const app = express();

app.use(express.json());

app.use(cors());
app.use("/auth", authRouter);

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo DB connected,");
  return client;
}

export const client = await createConnection();
const client_secret = process.env.CLIENT_SECRET;
const client_id = process.env.CLIENT_ID;
const redirect_uris = process.env.REDIRECT_URIS;
// console.log("redirect_uris", redirect_uris);
export const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  "http://localhost:5000/auth/handleGoogleRedirect" // server redirect url handler
);

app.get("/", (req, res) => {
  console.log("default request accepted");
  res.send("default request accepted");
});

app.listen(PORT, () => {
  console.log("listening to request at", PORT);
});
