const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/UserSchema");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const d = new Date(year, month, date) + 5.5 * 60 * 60 * 1000;
    // console.log(d);
    let details = { date: d, biceps: 0, triceps: 0, squats: 0, calories: 0 };
    await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      height: req.body.height,
      weight: req.body.weight,
      password: hashPassword,
      data: details,
    });
    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(401).json({ status: "error", error: "Duplicate Email" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res
      .status(400)
      .json({ status: "error", user: false, error: "Invalid login" });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    // console.log(token);

    res.status(200).json({ status: "ok", user: token });
  } else {
    res
      .status(400)
      .json({ status: "error", user: false, error: "Invalid login" });
  }
});

module.exports = router;
