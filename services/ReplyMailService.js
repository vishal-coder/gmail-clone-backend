//https://stackoverflow.com/questions/65688769/gmail-api-replying-to-email-thread-using-nodejs

//https://stackoverflow.com/questions/67262471/how-to-reply-to-threadid-using-gmail-api-in-node-js
// The solution is to keep Message-Id as In-Reply-To and References You need to update the In-Reply-To and References values like below
import { google } from "googleapis";
import { oAuth2Client } from "../index.js";
export async function replyMail(id, body) {
  var gmail = await google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  const res = await gmail.users.messages.get({
    userId: "me",
    // id: "182d8a94207361d3",
    id: id,
    format: "full",
  });

  console.log("at end getmail-", res);
  // console.log("at end mail body is-", res.data.payload.parts[0].body.data);
  var decodedMailBody = Buffer.from(
    res.data.payload.parts[0].body.data,
    "base64"
  ).toString("ascii");

  let replyTo;
  let replyFrom;
  let mailSubject;
  let ref;
  let InReply;
  res.data.payload.headers.map(function (header) {
    if (header.name == "To") {
      replyFrom = header.value;
    }
    if (header.name == "From") {
      replyTo = header.value.substring(
        header.value.indexOf("<") + 1,
        header.value.length - 1
      );
      console.log("header-=-=-=", replyTo);
    }
    if (header.name == "Subject") {
      mailSubject = header.value;
    }
    if (header.name === "Message-ID" || header.name === "Message-Id") {
      ref = header.value;
      InReply = header.value;
    }
  });
  const mailMody = makeBody(
    ref,
    InReply,
    replyFrom,
    replyTo,
    mailSubject,
    body + decodedMailBody
  );
  sendMail(gmail, oAuth2Client, mailMody);
}

function makeBody(ref, InReply, from, to, subject, message) {
  var str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "References:",
    ref,
    "\n" + "In-Reply-To:",
    InReply,
    "\n" + "to:vishal2app@gmail.com",
    // to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");
  console.log("mail strin gis", str);

  var encodedMail = Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
}
async function sendMail(gmail, auth, raw) {
  // var raw = makeBody(to, "onlinemailtesting@gmail.com", subject, body);
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
