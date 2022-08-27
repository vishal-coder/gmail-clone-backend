//https://stackoverflow.com/questions/30995341/forward-mail-using-gmail-api?rq=1

// /https://stackoverflow.com/questions/30995341/forward-mail-using-gmail-api
import { google } from "googleapis";
import { oAuth2Client } from "../index.js";
export async function ForwardMail(id, to, body) {
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

  let from;
  let sender;
  let date;
  let mailSubject;

  console.log("at end getmail-", res);
  // console.log("at end mail body is-", res.data.payload.parts[0].body.data);
  var decodedMailBody = Buffer.from(
    res.data.payload.parts[0].body.data,
    "base64"
  ).toString("ascii");

  //   var encodedMail = new Buffer(mailBody)
  //     .toString("base64")
  //     .replace(/\+/g, "-")
  //     .replace(/\//g, "_");
  //   res.data.payload.parts[0].body.data = encodedMail;
  res.data.payload.headers.map(function (header) {
    if (header.name == "To") {
      sender = header.value;
    }
    if (header.name == "From") {
      from = header.value;
    }
    if (header.name == "Date") {
      date = header.value;
    }
    if (header.name == "Subject") {
      mailSubject = header.value;
    }
  });

  let defaultForwardMsg = `---------- Forwarded message ---------
from: ${from}, 
Date:${date}, 
subject: ${mailSubject}, 
Sender:  ${sender}`;
  const mailBody = defaultForwardMsg + "\n\n" + body + "\n\n" + decodedMailBody;

  //   console.log("at end encodedMail-", encodedMail);
  sendMail(gmail, oAuth2Client, to, mailSubject, mailBody);

  return res.data.labelIds;
}

async function sendMail(gmail, auth, to, subject, body) {
  var raw = makeBody(to, "onlinemailtesting@gmail.com", subject, body);
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

function makeBody(to, from, subject, message) {
  var str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");
  var encodedMail = new Buffer(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
}
