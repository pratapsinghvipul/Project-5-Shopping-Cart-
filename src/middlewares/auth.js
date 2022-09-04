//👇👇👇👇👇👇👇👇👇[Hello Mr Dk it's Auth-Controller]👇👇👇👇👇👇👇👇👇//

const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("../validators/valitor");
const userModel = require("../models/userModels");

//************************[👇Authentication Function's 👇]***********************//
const authentication = async function (req, res, next) {
  try {
    let token = req.headers.authorization;

    // if no token found
    if (!token) {
      return res.status(400).send({
        status: false,
        message: "Token required! Please login to generate token",
      });
    }

    // This👇 is written here to avoid internal server error (if token is not present)
    token = token.split(" ")[1];

    jwt.verify(
      token,
      "DharmendrayadavGroup43",
      { ignoreExpiration: true },
      function (error, decodedToken) {
        // if token is invalid
        if (error) {
          return res.status(400).send({
            status: false,
            message: "Token is invalid",
          });
        }
        // if token is valid
        else {
          // if token expired
          if (Date.now() > decodedToken.exp * 1000) {
            return res.status(401).send({
              status: false,
              message: "Session Expired",
            });
          }
          req.userId = decodedToken.userId;
          next();
        }
      }
    );
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//***************************[👇Authorisation Function's👇]**********************//
const authorisation = async function (req, res, next) {
  try {
    let userId = req.params.userId; //user-Id Comming in req-param 

    // if userId is not a valid ObjectId
    if (!isValidObjectId(userId)) {
      res
        .status(400)
        .send({ status: false, message: `${userId} is not a valid userId` });
      return;
    }

    // if user does not exist
    let isUserExist = await userModel.findById(userId);
    if (!isUserExist) {
      return res
        .status(404)
        .send({ status: false, msg: "user does not exist" });
    }

    //📌 AUTHORISATION:👇
    if (req.userId !== userId) {
      return res.status(401).send({
        status: false,
        message: `Authorisation failed; You are logged in as ${req.userId}, not as ${userId}`,
      });
    }

    next();
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//***************************[👇Function's Publically👇]*************************//
module.exports = { authentication, authorisation };

//👌👌👌👌👌👌👌[Thank You Mr Dkyadav AWS-Controller End]👌👌👌👌👌👌👌👌//
