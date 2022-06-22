const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/auth");
const exerciseRoute = require("./routes/exercise");
const userRoute = require("./routes/user");
require("dotenv").config();

const client = require("twilio")(
  "AC4b637e7ed06a85954387e5282659a26b",
  "cd76ac8c9ce011967fecb99200a19ad5"
);
const PORT = process.env.PORT || 5000;

// +1 334 459 9701
// +16165778934;

app.use(express.json());
app.use(cors());

require("./db/connection");

// function msg() {
//   client.messages
//     .create({
//       body: "This is the ship that made the Kessel Run in fourteen parsecs?",
//       from: "+16165778934",
//       to: "+919337157734",
//     })
//     .then((message) => console.log(message.sid))
//     .catch((err) => console.log(err));
// }

app.get("/", (req, res) => {
  // msg();
  res.send("Hello World from server of SIH-22");
});

app.use("/api/auth", authRoute);
app.use("/api/exercise", exerciseRoute);
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
