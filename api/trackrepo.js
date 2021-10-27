const mongoPromise = require("./_mongo");

module.exports = async (req, res) => {
  const mongo = await mongoPromise;

  const { username, repo } = req.body;
  if (typeof username !== "string" || typeof repo !== "string") {
    res.status(400).json({ message: "Invalid body" });
    return;
  }

  const usersCol = mongo.db().collection("users");
  const user = await usersCol.findOne({ _id: username });
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }
  user.trackedRepos = !user.trackedRepos ? [repo] : [...user.trackedRepos, repo];
  // Helps avoid duplicates
  user.trackedRepos = [...new Set(user.trackedRepos)];
  await usersCol.updateOne({ _id: username }, { $set: user });
  res.status(200).json({ user });
};
