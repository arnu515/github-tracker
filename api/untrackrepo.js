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
  if (!Array.isArray(user.trackedRepos)) {
    user.trackedRepos = [];
  } else {
    user.trackedRepos = user.trackedRepos.filter(r => r !== repo);
  }
  await usersCol.updateOne({ _id: username }, { $set: user });
  res.status(200).json({ user });
};
