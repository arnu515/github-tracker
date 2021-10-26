const webPush = require("web-push");

webPush.setVapidDetails(
  "https://github-tracker-arnu515.vercel.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = (_, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
};
