import { oAuth2Client } from "../index.js";
import { authorize } from "../services/AuthService.js";
import { getUser } from "../services/GetUser.js";
import { google } from "googleapis";
import { client } from "../index.js";
import jwt from "jsonwebtoken";
import { getRefreshToken, storeRefreshToken } from "../models/AuthModel.js";
import { getLabelList } from "../services/GetLabels.js";
import { fetchMailList } from "../services/GetMailList.js";
import { deleteMail } from "../services/DeleteMail.js";

//https://github.com/googleapis/google-api-nodejs-client#authorizing-and-authenticating

//create aurhLink and sends in response to google
export const createAuthLink = async (req, res) => {
  // check for authorization and get access token and refresh token
  const authUrl = await authorize();

  console.log("Authorize this app by visiting this url:", authUrl);
  res.send({ authUrl: authUrl, success: true });
};

//this function handles response of authorization by user
// and get code from url to generate tokens
export const handleGoogleRedirect = async (req, res) => {
  console.log("handleGoogleRedirect");
  const code = req.query.code;

  oAuth2Client.getToken(code, async (err, tokens) => {
    if (err) {
      console.log("server 39 | error", err);
      res.status(403).send({ success: false, message: "Plese provide access" });
      throw new Error("Issue with Login", err.message);
    }
    console.log("tokens tokens", tokens);
    console.log("tokens tokens.refresh_token", tokens.refresh_token);
    oAuth2Client.setCredentials(tokens);
    console.log("- oAuth2Client- tokens", oAuth2Client);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    //token expiration details
    const tokenInfo = await oAuth2Client.getTokenInfo(
      oAuth2Client.credentials.access_token
    );
    console.log("tokenInfo", tokenInfo);

    let oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });
    console.log("now calling get user profile");
    let { data } = await oauth2.userinfo.get(); // get user info
    console.log("user profile is---", data);
    var token = jwt.sign({ id: data.email }, process.env.SECRET_KEY);

    if (accessToken && refreshToken) {
      storeRefreshToken(data.email, refreshToken);
      console.log("saved in DB----------------", tokens.refresh_token);
    } else {
      const userDBData = await getRefreshToken(data.email);
      oAuth2Client.credentials.refresh_token = userDBData.refresh_token;
      console.log("tokens.userDBData only", userDBData);
      console.log("updated oAuth2Client", oAuth2Client);
      console.log("tokens.access_token only", tokens.access_token);
    }

    oAuth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log(tokens.refresh_token);
      }
      console.log(tokens.access_token);
    });

    res.header("x-auth-token", token);
    res.redirect("http://localhost:3000/?token=" + token);
  });
};

export const handlegGetUserProfile = async (req, res) => {
  console.log("Inside handlegGetUserProfile", oAuth2Client);

  const data = await getUser();
  res.send({ data: data, success: true });
};

export const handlegGetLabelList = async (req, res) => {
  console.log("Inside handlegGetLabelList", new Date());
  let labellist = null;

  var gmail = google.gmail({
    auth: oAuth2Client,
    version: "v1",
  });
  const resp = await gmail.users.labels.list({
    userId: "me",
  });
  //console.log("Inside handlegGetLabelList", resp.data.labels);
  res.send({ data: resp.data.labels, success: true });
};

export const handleLogoutUser = async (req, res) => {
  console.log("Inside handleLogoutUser");

  oAuth2Client.revokeCredentials(function (err, body) {
    if (err) {
      console.log("error while logout is", err);
    } else {
      console.log("user loggedout successfully ");
    }
  });
  return res.send({ success: true, message: "user loggedout successfully" });
};

export const handleGetMails = async (req, res) => {
  console.log("Inside handleGetMails");

  const { mailOption } = req.body;
  console.log("user handleGetMails  ", mailOption);

  const data = await fetchMailList(mailOption);
  //console.log("user handleGetMails- data  ", data);
  return res.send({
    data: data,
    success: true,
    message: "mail fetched  successfully",
  });
};

export const handleDeleteMails = (req, res) => {
  console.log("user handleDeleteMails:");
  const { id } = req.body;
  console.log("user handleDeleteMails  ", id);

  deleteMail(id);
  return res.send({
    success: true,
    message: "mail fetched  successfully",
  });
};
