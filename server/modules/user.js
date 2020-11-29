import mongoose from "mongoose";

//create Schema
const UserShcema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["MainAdmin", "Admin", "User"],
    default: "User",
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
      comment_id: {
        type: mongoose.Schema.type.ObjectId,
        ref: "comments",
      },
    },
  ],
});

const User = mongoose.model("User", UserShcema);

export default User;
