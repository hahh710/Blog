import express from "express";

//Encryting
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

//Model
import User from "../../models/user";

import config from "../../config/index";
const { JWT_SECRET } = config;

const router = express.Router();

// @routes      GET api/user
// @desc        Getting all user
// @access      public

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUusers) throw Error("No Users");
    res.status(200).json(allUsers);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      Message: e.message,
    });
  }
});

// @routes      Post api/user
// @desc        Registering new user
// @access      public

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    console.log("Missing Inquiry", req.body);
    return res.status(400).json({ message: " Missing inquiry" });
  }

  // Check for existing user by E - mail
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ Message: "Existing user" });
    }

    const newUser = new User({ name, email, password });

    //Encrypting password to Hash code
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

export default router;

/*
router.post("/",async(req,res)=>{
try{
    const {name, email, password}  =  req.body

    //storing a data to DB
    const newUser = await User.create({
        name,
        email,
        password
    }).then(()=>{
        
        res.status(200).json(newUser);
    }).catch((e)=>{
        console.log(e);
        res.status(400).json()
    }
}
catch(e){
    console.log(e);
    res.status(400).json({
      Message: e.message,
    });
  }
});
*/
