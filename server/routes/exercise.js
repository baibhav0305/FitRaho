const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { spawn } = require("child_process");
const User = require("../model/UserSchema");

// BICEPS
router.get("/biceps", (req, res) => {
  let dataToSend;
  const python = spawn("python", ["biceps.py"]);
  python.stdout.on("data", (data) => {
    console.log("Biceps script started...");
    dataToSend = data.toString();
  });
  python.on("close", () => {
    console.log(`Biceps script ended...`);
    res.json({ count: dataToSend });
  });
});

// TRICEPS
router.get("/triceps", (req, res) => {
  let dataToSend;
  const python = spawn("python", ["biceps.py"]);
  python.stdout.on("data", (data) => {
    console.log("Triceps script started...");
    dataToSend = data.toString();
  });
  python.on("close", () => {
    console.log(`Triceps script ended...`);
    res.json({ count: dataToSend });
  });
});

// PUSHUPS || SQUATS
router.get("/pushups", (req, res) => {
  let dataToSend;
  const python = spawn("python", ["check1.py"]);
  python.stdout.on("data", (data) => {
    console.log("Squats script started...");
    dataToSend = data.toString();
  });
  python.on("close", () => {
    console.log(`Squats script ended...`);
    res.json({ count: dataToSend });
  });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// POST EXERCISE DATA
router.post("/", async (req, res) => {
  const token = req.headers["x-access-token"];
  let { count, exercise } = req.body;
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;

    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const d = new Date(year, month, date) + 5.5 * 60 * 60 * 1000;

    const user = await User.findOne({ email: email }, { data: { $slice: -1 } });

    const ndata = user.data;
    console.log(ndata[0]);
    if (ndata[0] && ndata[0].date === d) {
      if (exercise === "biceps") {
        let ctr = count + ndata[0].calories;
        count = count + ndata[0].biceps;
        await User.findOneAndUpdate(
          { email: email, "data.date": d },
          { $set: { "data.$.biceps": count, "data.$.calories": ctr } }
        );
      } else if (exercise === "triceps") {
        let ctr = count + ndata[0].calories;
        count = count + ndata[0].triceps;
        await User.findOneAndUpdate(
          { email: email, "data.date": d },
          { $set: { "data.$.triceps": count, "data.$.calories": ctr } }
        );
      } else {
        let ctr = 2 * count + ndata[0].calories;
        count = count + ndata[0].squats;
        await User.findOneAndUpdate(
          { email: email, "data.date": d },
          { $set: { "data.$.squats": count, "data.$.calories": ctr } }
        );
      }
    } else {
      let newData;
      if (exercise === "biceps") {
        newData = {
          date: d,
          biceps: count,
          triceps: 0,
          squats: 0,
          calories: count,
        };
      } else if (exercise === "triceps") {
        newData = {
          date: d,
          biceps: 0,
          triceps: count,
          squats: 0,
          calories: count,
        };
      } else {
        newData = {
          date: d,
          biceps: 0,
          triceps: 0,
          squats: count,
          calories: 2 * count,
        };
      }
      await User.findOneAndUpdate(
        { email: email },
        { $push: { data: newData } }
      );
    }

    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "Invalid Token" });
  }
});

module.exports = router;
