import { oAuth2Client } from "../index.js";
import { google } from "googleapis";

export const deleteMail = (id) => {
  var gmail = google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  const res = gmail.users.messages.delete({
    id: id,
    userId: "me",
  });
  return res;
};
