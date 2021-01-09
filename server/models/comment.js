import mongoose from "mongoose";
import moment from "moment";

const CommentSchema = new mongoose.Schema({
  contents: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  //to grab a creator name from ref, it is better have creatorName from Creator ref user,
  creatorName: {
    type: String,
  },
});

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
