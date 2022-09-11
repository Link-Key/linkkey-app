import store from "../Store";

const twitterOAuth2URL = "https://twitter.com/i/oauth2/authorize?";
export const params = {
  response_type: "code",
  client_id: "WGZiaXk5dGczU3EyZFgwenAyWmg6MTpjaQ",
  redirect_uri: "http://localhost:3000/Setting",
  state: "state",
  code_challenge: store.getState().walletInfo.account,
  code_challenge_method: "plain",
  scope:
    "users.read%20tweet.read%20tweet.write%20follows.read%20follows.write%20offline.access%20like.read%20like.write",
};

function constructAuthorizeURL() {
  console.log("code_challenge:", params.code_challenge);
  return (
    twitterOAuth2URL +
    `response_type=${params.response_type}&client_id=${
      params.client_id
    }&redirect_uri=${params.redirect_uri}&state=${
      params.state
    }&code_challenge=${
      store.getState().walletInfo.account
    }&code_challenge_method=${params.code_challenge_method}&scope=${
      params.scope
    }`
  );
}

export function getTwitterDataWithOAuth2() {
  window.location.href = constructAuthorizeURL();
}
