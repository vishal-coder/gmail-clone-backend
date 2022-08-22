import { client } from "../index.js";

export function storeRefreshToken(email, refresh_token) {
  const query = {
    email: email,
    refresh_token: refresh_token,
    created_date: new Date(),
  };
  return client.db("gmail").collection("users").insertOne(query);
}

export function getRefreshToken(email) {
  const query = {
    email: email,
  };
  return client.db("gmail").collection("users").findOne(query);
}
