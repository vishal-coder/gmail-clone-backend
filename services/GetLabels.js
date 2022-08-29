import { google } from "googleapis";
import { oAuth2Client } from "../index.js";

export async function getLabelList() {
  let labellist = null;
  var gmail = await google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  await gmail.users.labels.list(
    {
      userId: "me",
    },
    async (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      labellist = await res.data.labels;
      if (labellist.length) {
      } else {
        console.log("No labels found.");
      }
    }
  );
  return labellist;
}
