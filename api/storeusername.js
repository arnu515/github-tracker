const mongoPromise = require("./_mongo");

module.exports = async (req, res) => {
  const mongo = await mongoPromise;

  const { username } = req.body;
  if (typeof username !== "string" || !username.trim()) {
    res.status(400).json({ message: "Please send the username" });
    return;
  }

  // Get the collection
  const usersCol = mongo.db().collection("users");

  // Check if the username already exists in the database
  if (await usersCol.findOne({ _id: username })) {
    res.status(400).json({ message: "User already exists!" });
    return;
  }

  // We want the username to be the identifier of the user
  await usersCol.insertOne({ _id: username });

  // Everything went well :)
  res.status(200).json({ message: "Username recorded" });
};
