//https://www.labnol.org///google-api-service-account-220405

// https://fusebit.io/blog/gmail-api-node-tutorial/?utm_source=www.google.com&utm_medium=referral&utm_campaign=none

//https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/gmail/send.js

//https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#send

//https://www.faqcode4u.com/faq/57184/gmail-api-for-sending-mails-in-nodejs
//https://stackoverflow.com/questions/30995341/forward-mail-using-gmail-api?rq=1

// /https://stackoverflow.com/questions/30995341/forward-mail-using-gmail-api
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
      console.log(err || response);
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
