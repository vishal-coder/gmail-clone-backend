import express from "express";
import {
  createAuthLink,
  handleGoogleRedirect,
  handlegGetUserProfile,
  handlegGetLabelList,
  handleLogoutUser,
  handleGetMails,
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

export const authRouter = router;
