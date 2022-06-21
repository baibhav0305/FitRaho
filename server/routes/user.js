const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");

router.get("/", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", data: user.data });
  } catch (error) {
    res.json({ status: "error", error: "invalid token" });
  }
});

module.exports = router;
