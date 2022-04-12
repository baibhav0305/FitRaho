const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { spawn } = require("child_process");
const client = require("twilio")(
  "AC4b637e7ed06a85954387e5282659a26b",
  "cd76ac8c9ce011967fecb99200a19ad5"
);

// +1 334 459 9701
// +16165778934;

// const bodyParser = require('body-parser');
const User = require("./model/UserSchema");

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

require("./db/connection");

const PORT = process.env.PORT || 8000;

function msg() {
  client.messages
    .create({
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      from: "+16165778934",
      to: "+919337157734",
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err));
}

app.get("/", (req, res) => {
  // msg();
  res.send("Hello World from server of SIH-22");
});

app.post("/api/register", async (req, res) => {
  // console.log(req.body);
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const d = new Date(year, month, date) + 5.5 * 60 * 60 * 1000;
    console.log(d);
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
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "Duplicate Email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return { status: "error", error: "Invalid login" };
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

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/biceps", (req, res) => {
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

app.get("/api/triceps", (req, res) => {
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

app.get("/api/squats", (req, res) => {
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
app.post("/api/post", async (req, res) => {
  const token = req.headers["x-access-token"];
  let { count, exercise } = req.body;
  console.log(count, exercise);
  // console.log(token);
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;

    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const d = new Date(year, month, date) + 5.5 * 60 * 60 * 1000;
    console.log(d + 5.5 * 60 * 60 * 1000);

    const user = await User.findOne({ email: email }, { data: { $slice: -1 } });

    const ndata = user.data;
    console.log(ndata);
    // console.log(ndata[0].date);
    // console.log(ndata[0].biceps);
    // console.log(ndata[0].triceps);
    // console.log(ndata[0].calories);
    // console.log(user);
    if (ndata[0].date === d) {
      if (exercise === "biceps") {
        let ctr = count + ndata[0].calories;
        count = count + ndata[0].biceps;
        // console.log(ctr);
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
        let ctr = 2 * count + ndata[0].squats;
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
          calories: 0,
        };
      } else if (exercise === "triceps") {
        newData = {
          date: d,
          biceps: 0,
          triceps: count,
          squats: 0,
          calories: 0,
        };
      } else {
        newData = {
          date: d,
          biceps: 0,
          triceps: 0,
          squats: count,
          calories: 0,
        };
      }
      await User.findOneAndUpdate(
        { email: email },
        { $push: { data: newData } }
      );
    }
    // console.log(user);
    // console.log(data);

    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid Token" });
  }
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

app.get("/api/history", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", data: user.data });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
