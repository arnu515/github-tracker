const mongoPromise = require("./_mongo");

module.exports = async (req, res) => {
  const mongo = await mongoPromise;

  const { pat } = req.body;
  if (typeof pat !== "string" || !pat.trim()) {
    res.status(400).json({ message: "Please send the PAT" });
    return;
  }

  // Get the collection
  const usersCol = mongo.db().collection("users");

  // Check if the PAT already exists in the database
  if (await usersCol.findOne({ _id: pat })) {
    res.status(400).json({ message: "User already exists!" });
    return;
  }

  // We want the PAT to be the identifier of the user
  await usersCol.insertOne({ _id: pat });

  // Everything went well :)
  res.status(200).json({ message: "PAT recorded" });
};
