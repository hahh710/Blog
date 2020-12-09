import express from "express";
import auth from "../../middleware/auth";

//Model
import Post from "../../models/post";

const router = express.Router();

//  api/post
router.get("/", async (req, res) => {
  const postFindResult = await Post.find(); // Post is mongoose model, and contains find() method for finding
  console.log(postFindResult, "All Post are found.");
  res.json(postFindResult);
});

router.post("/", auth, async (req, res) => {
  try {
    console.log(req, "req");
    const { title, contents, fileUrl, creator } = req.body;
    const newPost = await Post.create({
      //만들어주세요
      title, //this means title: title
      contents,
      fileUrl,
      creator,
    });
    res.json(newPost);
  } catch (e) {}
});

export default router;
