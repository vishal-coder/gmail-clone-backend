import { google } from "googleapis";
import { oAuth2Client } from "../index.js";

export async function getUser() {
  let oauth2 = google.oauth2({
    auth: oAuth2Client,
    version: "v2",
  });
  console.log("now calling get user profile");
  let { data } = await oauth2.userinfo.get();
  return data;
}
