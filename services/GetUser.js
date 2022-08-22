import { google } from "googleapis";
export function getUser(auth) {
  // getGoogleUser(auth);
  console.log("auth in getuser", auth);

  var gmail = google.gmail({
    auth: auth,
    version: "v1",
  });
  gmail.users.getProfile(
    {
      auth: auth,
      userId: "me",
    },
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log("inside else of get profile");
        console.log("emailAddress", res.data.emailAddress);
        console.log(JSON.stringify(res));
        return res;
      }
    }
  );
}
