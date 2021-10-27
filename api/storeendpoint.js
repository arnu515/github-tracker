const mongoPromise = require("./_mongo");

module.exports = async (req, res) => {
  const mongo = await mongoPromise;
  const usersCol = mongo.db().collection("users");
  const { username, subscription } = req.body;
  if (typeof username !== "string" || typeof subscription !== "object") {
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  await usersCol.updateOne(
    { _id: username },
    {
      $set: {
        subscription
      }
    }
  );
  res.status(204).end();
};
