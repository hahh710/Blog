import express from "express";
import auth from "../../middleware/auth";

//Model
import Post from "../../models/post";
import Categories from "../../models/category";
import User from "../../models/user";
import moment from "moment";

const router = express.Router();

import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { isNullOrUndefined } from "util";

dotenv.config();

//s3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
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
      url: req.files.map((v) => v.location),
    });
  } catch (e) {
    console.error(e);
    res.json({
      upload: false,
      url: null,
    });
  }
});

//  @route  GET api/post/
//  @desc   Getting All posts
//  @access public
router.get("/", async (req, res) => {
  const postFindResult = await Post.find(); // Post is mongoose model, and contains find() method for finding
  //console.log(postFindResult, "All Post are found.");
  res.json(postFindResult);
});

//  @route  POST /api/post/
//  @desc   Creating new post
//  @acess  Private
router.post("/", auth, uploadS3.none(), async (req, res) => {
  //uploadS3 is middle ware to upload data to S3, However,
  //images used in editor is already uploaded before this method, Therefore, None()
  try {
    //console.log(req, "req");
    const { title, contents, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      //만들어주세요
      title, //this means title: title
      contents,
      fileUrl,
      creator: req.user.id,
      date: moment().format("YYYY-MM-DD hh:mm:ss"),
    });

    const findResult = await Categories.findOne({
      categoryName: category,
    });

    //console.log(findResult, "categories Found");

    if (isNullOrUndefined(findResult)) {
      const newCategory = await Categories.create({
        categoryName: category,
      });
      console.log(newCategory, "New Category is created");

      //Referencing new Category to newPost
      await Post.findByIdAndUpdate(newPost._id, {
        $push: { categories: newCategory._id },
      });

      //Referencing post to new Category
      await Categories.findByIdAndUpdate(newCategory._id, {
        $push: { posts: newPost._id },
      });

      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          posts: newPost._id,
        },
      });
    } else {
      await Categories.findByIdAndUpdate(findResult._id, {
        $push: { posts: newPost._id },
      });

      await Post.findByIdAndUpdate(newPost._id, {
        $push: { category: findResult._id },
      });

      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: newPost._id,
        },
      });
    }

    //res.json(newPost);

    return res.redirect(`/api/post/${newPost._id}`);
  } catch (e) {
    console.log(e);
  }
});

//  @route  GET  api/post/:id
//  @desc   Detail Post
//  @access Public
router.get("/:id", async (req, res, next) => {
  try {
    //console.log(req, "GET ID REQUEST");
    const post = await Post.findById(req.params.id)
      .populate({ path: "creator", model: "User", select: "name" })
      .populate({ path: "categories", select: "categoryName" });
    post.views += 1;
    post.save();
    console.log(post, "GET FIND BY ID");
    res.json(post);
  } catch (e) {
    console.error(e, "GET FIND BY ID ERROR");
    next(e);
  }
});

export default router;
