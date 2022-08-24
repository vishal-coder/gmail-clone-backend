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
    labelIds: "INBOX",
  });
  const mlist = res.data.messages;
  console.log("mlist is---", res.data.messages);

  const mailList = await getmailMetaData(gmail, mlist);

  console.log("mailList--at return end is", mailList);
  return mailList;
};

async function getmailMetaData(gmail, mlist) {
  const mailList = [];

  for (let mail in mlist) {
    mailList.push(await getmail(gmail, mlist[mail].id));
  }

  console.log("mailList--getmailMetaData", mailList);
  return mailList;
}

async function getmail(gmail, id) {
  const res = await gmail.users.messages.get({
    userId: "me",
    id: id,
    format: "metadata",
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
  const snippet = res.data.snippet;
  let from;
  let date;
  res.data.payload.headers.map(function (header) {
    if (header.name == "From") {
      // console.log(
      //   "header object is",
      //   header.value.substring(0, header.value.indexOf("<"))
      // );
      from = header.value.substring(0, header.value.indexOf("<"));
    }
    if (header.name == "Date") {
      //console.log("rawDate", header.value);
      const rawDate = new Date(header.value);
      //  console.log("rawDate", rawDate);
      date = `${rawDate.getDate()} ${monthNames[rawDate.getMonth()]}`;
    }
  });
  //console.log("resonse in push list is", starred, from, snippet, date);
  const mailData = {
    isStarred: starred,
    from: from,
    snippet: snippet,
    date: date,
  };
  return mailData;
}
