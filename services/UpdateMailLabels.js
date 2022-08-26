import { oAuth2Client } from "../index.js";
import { google } from "googleapis";

export const updateMailLabels = (id, addLabels, removeLabels) => {
  var gmail = google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  const res = gmail.users.messages.modify({
    id: id,
    userId: "me",
    requestBody: {
      addLabelIds: addLabels,
      removeLabelIds: removeLabels,
    },
  });
  return res;
};
