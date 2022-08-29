import dotenv from "dotenv";
import express from "express";
import { authRouter } from "./routes/Authroute.js";
import cors from "cors";
import { google } from "googleapis";
import { MongoClient } from "mongodb";

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

export const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris // server redirect url handler
);

app.get("/", (req, res) => {
  console.log("default request accepted");
  res.send("default request accepted");
});

app.listen(PORT, () => {
  console.log("listening to request at", PORT);
});
