const mongoPromise = require("./_mongo");

module.exports = async (req, res) => {
  const mongo = await mongoPromise;
  const username = req.query.username;
  if (typeof username !== "string" || !username.trim()) {
    res.status(401).json({ message: "Please send `username` in the querystring." });
    return;
  }

  const usersCol = mongo.db().collection("users");
  const user = await usersCol.findOne({ _id: username });
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }
  let repositories = [];
  if (Array.isArray(user.trackedRepos)) {
    repositories = user.trackedRepos;
  }
  res.status(200).json({ repositories });
};
