import express from "express";
import {
  createAuthLink,
  handleGoogleRedirect,
  handlegGetUserProfile,
  handlegGetLabelList,
  handleLogoutUser,
  handleGetMails,
  handleDeleteMails,
  handleUpdateMailLabels,
  handleForwardMail,
  handleReplyMail,
} from "../controller/AuthController.js";

import { auth } from "../middleware/MiddlewareAuth.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("default request made");
  res.send("default request made");
});

router.get("/createAuthLink", createAuthLink);
router.get("/handleGoogleRedirect", handleGoogleRedirect);
// router.get("/redirect", handleRedirect);
router.get("/getUserProfile", auth, handlegGetUserProfile);
router.get("/getLabelList", auth, handlegGetLabelList);
router.get("/logoutUser", auth, handleLogoutUser);
router.post("/getMails", auth, handleGetMails);
router.post("/deleteMail", auth, handleDeleteMails);
router.post("/updateMailLabels", auth, handleUpdateMailLabels);
router.post("/forwardMail", auth, handleForwardMail);
router.post("/replyMail", auth, handleReplyMail);

export const authRouter = router;
