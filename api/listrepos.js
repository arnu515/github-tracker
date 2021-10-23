const mongoPromise = require("./_mongo");

module.exports = async (req, res) => {
  const mongo = await mongoPromise;
  const pat = req.query.pat;
  if (typeof pat !== "string" || !pat.trim()) {
    res.status(401).json({ message: "Please send `pat` in the querystring." });
    return;
  }

  const usersCol = mongo.db().collection("users");
  const user = await usersCol.findOne({ _id: pat });
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }
  let repositories = [];
  if (Array.isArray(user.trackedRepos)) {
    repositories = user.trackedRepos;
  }
  res.status(200).json({ repositories });
};
