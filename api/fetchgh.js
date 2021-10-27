const mongoPromise = require("./_mongo");
const webPush = require("web-push");
const axios = require("axios");

webPush.setVapidDetails(
  "https://github-tracker-arnu515.vercel.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function fetchRepo(repo) {
  const mongo = await mongoPromise;
  const fetchedCol = mongo.db().collection("fetched");
  const lastFetchedDoc = await fetchedCol.findOne({}, { sort: { createdAt: -1 } });
  const timestamp = lastFetchedDoc ? lastFetchedDoc.createdAt : null;

  const { data: issues } = await axios.get(
    `https://api.github.com/repos/${repo}/issues?state=open${
      timestamp ? "&since=" + timestamp : ""
    }`
  );
  if (Array.isArray(issues)) {
    await fetchedCol.insertOne({ createdAt: new Date() });
  }
  if (Array.isArray(issues) && issues.length > 0) return true;

  return false;
}

module.exports = async (_, res) => {
  const mongo = await mongoPromise;
  const usersCol = mongo.db().collection("users");
  const users = await usersCol.find().toArray();
  const alreadyFetchedRepos = [];
  const reposWithIssues = [];

  for await (let user of users) {
    // Make sure to fetch each repo ONCE.
    const reposToFetch = user.trackedRepos.filter(
      i => !alreadyFetchedRepos.includes(i)
    );
    await Promise.all(
      reposToFetch.map(async repo => {
        const hasNewIssues = await fetchRepo(repo);
        alreadyFetchedRepos.push(repo);
        if (hasNewIssues) reposWithIssues.push(repo);
      })
    );
  }

  for await (let user of users) {
    // Send push notifications
    if (user.trackedRepos.some(i => reposWithIssues.includes(i))) {
      await webPush.sendNotification(user.subscription, "new-issue");
    }
  }

  // And we're done!
  res.status(200).json({ reposWithIssues, fetched: alreadyFetchedRepos });
};
