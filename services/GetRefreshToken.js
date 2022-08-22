// If you need to obtain a new refresh_token, ensure the call to generateAuthUrl sets the access_type to offline. The refresh token will only be returned for the first authorization by the user. To force consent, set the prompt property to consent:

// // Generate the url that will be used for the consent dialog.
// const authorizeUrl = oAuth2Client.generateAuthUrl({
//   // To get a refresh token, you MUST set access_type to `offline`.
//   access_type: 'offline',
//   // set the appropriate scopes
//   scope: 'https://www.googleapis.com/auth/userinfo.profile',
//   // A refresh token is only returned the first time the user
//   // consents to providing access.  For illustration purposes,
//   // setting the prompt to 'consent' will force this consent
//   // every time, forcing a refresh_token to be returned.
//   prompt: 'consent'
// });
