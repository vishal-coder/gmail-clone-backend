/*After obtaining and storing an access_token, at a later time you may want to go check the expiration date, original scopes, or audience for the token. To get the token info, you can use the getTokenInfo method:


// after acquiring an oAuth2Client...
const tokenInfo = await oAuth2Client.getTokenInfo('my-access-token');

// take a look at the scopes originally provisioned for the access token
console.log(tokenInfo.scopes);
This method will throw if the token is invalid.*/
