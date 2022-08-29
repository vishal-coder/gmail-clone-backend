import { oAuth2Client } from "../index.js";
import { google } from "googleapis";

export const fetchMailList = async (options) => {
  var gmail = google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  options.maxResults = 10;

  const res = await gmail.users.messages.list(options);
  const mlist = res.data.messages;
  const mailList = await getmailMetaData(gmail, mlist);
  return mailList;
};

async function getmailMetaData(gmail, mlist) {
  const mailList = [];
  for (let mail in mlist) {
    mailList.push(await getmail(gmail, mlist[mail].id));
  }
  return mailList;
}

async function getmail(gmail, id) {
  try {
    const res = await gmail.users.messages.get({
      userId: "me",
      id: id,
      format: "full",
    });
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const starred = res.data.labelIds.includes("STARRED");
    const lables = res.data.labelIds;
    const snippet = res.data.snippet;
    let from;
    let sender;
    let sendingDate;
    let subject;
    let date;
    res.data.payload.headers.map(function (header) {
      if (header.name == "From") {
        sender = header.value;
        from = header.value.substring(0, header.value.indexOf("<"));
      }
      if (header.name == "Date") {
        const rawDate = new Date(header.value);
        sendingDate = header.value;
        date = `${rawDate.getDate()} ${monthNames[rawDate.getMonth()]}`;
      }
      if (header.name == "Subject") {
        subject = header.value;
      }
    });

    let mailBody = new Buffer(
      res.data.payload.parts[1].body.data,
      "base64"
    ).toString("utf-8");

    const mailData = {
      id: id,
      lables: lables,
      isStarred: starred,
      from: from,
      snippet: snippet,
      date: date,
      subject: subject,
      sender: sender,
      sendingDate: sendingDate,
      mailbody: mailBody,
    };
    return mailData;
  } catch (error) {
    console.log("error is get mail details is", error);
  }
}

export const fetchPageTokenInfo = async (options) => {
  var gmail = google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  options.maxResults = 2;

  const res = await gmail.users.messages.list(options);
  const nextPageToken = res.data.nextPageToken;
  const resultSizeEstimate = res.data.messages;

  return { pageToken: nextPageToken, resultSizeEstimate: resultSizeEstimate };
};
