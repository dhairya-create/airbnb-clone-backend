const asyncHandler = require("express-async-handler");
const bcrpyt = require("bcrypt");
const userModel = require("../models/User");

const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const registerUser = asyncHandler(async (req, res) => {
  //destructuring the info coming from client side
  const { name, email, password } = req.body;

  //Hashing the password
  const hashedPassword = await bcrpyt.hash(password, 10);
  try {
    const newUser = userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (err) {
    res.status(422).json(err);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Checking if user exists in database or not
  const user = await userModel.findOne({ email });

  if (user) {
    const passOK = bcrpyt.compareSync(password, user.password);

    if (passOK) {
      jwt.sign(
        { email: user.email, id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {},
        (err, token) => {
          if (err) {
            throw err;
          }
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.json("pass not ollk");
    }
  } else {
    // throw new Error("Not Found");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async (err, userData) => {
      if (err) {
        throw err;
      } else {
        const {name,email,_id} =  await UserModel.findById(userData.id)
        res.json({name,email,_id});
      }
    });
  } else {
    res.json(null);
  }
});


const userLogout = asyncHandler(async(req,res) => {

  res.cookie('token','').json(true)

})

module.exports = { registerUser, loginUser, getUserProfile,userLogout };
