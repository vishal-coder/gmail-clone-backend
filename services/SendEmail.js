import { google } from "googleapis";
import { oAuth2Client } from "../index.js";
export async function sendMail(to, Cc, Bcc, subject, body) {
  var gmail = await google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });

  const res = await sendgMail(gmail, oAuth2Client, to, Cc, Bcc, subject, body);

  return res;
}

async function sendgMail(gmail, auth, to, Cc, Bcc, subject, body) {
  var raw = makeBody(to, Cc, Bcc, "onlinemailtesting@gmail.com", subject, body);

  await gmail.users.messages.send(
    {
      auth: auth,
      userId: "me",
      resource: {
        raw: raw,
      },
    },
    function (err, response) {
      console.log(err);
    }
  );
}

function makeBody(to, Cc, Bcc, from, subject, message) {
  var str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "Cc: ",
    Cc,
    "\n",
    "Bcc: ",
    Bcc,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");
  console.log("make body of froward mail is", str);
  var encodedMail = new Buffer(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
}
