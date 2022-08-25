//https://fusebit.io/blog/gmail-api-node-tutorial/?utm_source=www.google.com&utm_medium=referral&utm_campaign=none

//https://developers.google.com/gmail/api/reference/rest/v1/Format
import { oAuth2Client } from "../index.js";
import { google } from "googleapis";

export const fetchMailList = async (options) => {
  var gmail = google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  const res = await gmail.users.messages.list({
    // The user's email address. The special value `me` can be used to indicate the authenticated user.
    userId: "me",
    labelIds: options.labelIds,
  });
  const mlist = res.data.messages;
  //console.log("mlist is---", res.data.messages);

  const mailList = await getmailMetaData(gmail, mlist);

  // console.log("mailList--at return end is", mailList);
  return mailList;
};

async function getmailMetaData(gmail, mlist) {
  const mailList = [];

  for (let mail in mlist) {
    mailList.push(await getmail(gmail, mlist[mail].id));
  }

  // console.log("mailList--getmailMetaData", mailList);
  return mailList;
}

async function getmail(gmail, id) {
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
      // console.log(
      //   "header object is",
      //   header.value.substring(0, header.value.indexOf("<"))
      // );
      sender = header.value;
      from = header.value.substring(0, header.value.indexOf("<"));
    }
    if (header.name == "Date") {
      //console.log("rawDate", header.value);
      const rawDate = new Date(header.value);
      sendingDate = header.value;
      //  console.log("rawDate", rawDate);
      date = `${rawDate.getDate()} ${monthNames[rawDate.getMonth()]}`;
    }
    if (header.name == "Subject") {
      subject = header.value;
    }
  });

  // console.log(
  //   "resonse for body.data is -",
  //   res.data.payload.parts[1].body.data
  // );
  let mailBody = new Buffer(
    res.data.payload.parts[1].body.data,
    "base64"
  ).toString("utf-8");

  // let text = buff;
  // console.log(buff);
  // const mailbody = res.data.payload.parts[1].body.data;

  //console.log("resonse in push list is", starred, from, snippet, date);
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
}
