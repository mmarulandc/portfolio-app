const axios = require("axios").default;
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
// require("dotenv").config();

module.exports.getTimelineTweetsByUsername = async (username) => {
  const {
    TWITTER_API_URL,
    TWITTER_ACCESS_TOKEN,
    TWITTER_TOKEN_SECRET,
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
  } = process.env;
  const oauth = OAuth({
    consumer: {
      key: TWITTER_CONSUMER_KEY,
      secret: TWITTER_CONSUMER_SECRET,
    },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto
        .createHmac("sha1", key)
        .update(base_string)
        .digest("base64");
    },
  });
  const request = {
    url: `${TWITTER_API_URL}/statuses/user_timeline.json?screen_name=${username}&count=5`,
    method: "GET",
  };
  const token = {
    key: TWITTER_ACCESS_TOKEN,
    secret: TWITTER_TOKEN_SECRET,
  };

  let config = {
    headers: oauth.toHeader(oauth.authorize(request, token)),
  };
  try {
    const { data } = await axios.get(request.url, config);
    const timelineTweets = data.map(tweet => {
      return {
        username: tweet.user.screen_name,
        text: tweet.text,
        userImage: tweet.user.profile_image_url
      }
    })
    return timelineTweets;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
