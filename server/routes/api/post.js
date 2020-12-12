import express from "express";
import auth from "../../middleware/auth";

//Model
import Post from "../../models/post";

const router = express.Router();

import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

//s3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer.MulterError({
  storage: multerS3({
    s3,
    bucket: "sideprojectblog/upload",
    region: "us-east-2",
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      //extending file name uploaded date
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// @route   POST api/post/image
// @desc    Creating a post
// @access  Private

router.post("/image", uploadS3.array("upload", 10), async (req, res, next) => {
  try {
    console.log(req.files.map((v) => v.location));
    res.json({
      uploaded: true,
      url: req.files.map((v)=>v.location)
    })
  } catch (e) {
    console.error(e);
    res.json({
      upload: false,
      url: null,
    });
  }
});

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
