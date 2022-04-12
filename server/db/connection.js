const mongoose = require("mongoose");

const MONGOOSE_URL =
  "mongodb+srv://admin:baibhav123@cluster0.5ihwr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(MONGOOSE_URL)
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((err) => {
    console.log(`connection failed`, err);
  });
