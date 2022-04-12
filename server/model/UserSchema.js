const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  data: [
    {
      date: {
        type: String,
      },
      biceps: {
        type: Number,
        default: 0,
      },
      triceps: {
        type: Number,
        default: 0,
      },
      squats: {
        type: Number,
        default: 0,
      },
      calories: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const User = mongoose.model("USER", userSchema);

module.exports = User;
