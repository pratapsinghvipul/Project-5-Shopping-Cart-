const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const router = require("./routers/route");
const multer = require("multer");

app.use(bodyparser.json()); //πConvertObject to JSON Form
app.use(multer().any());

//************************[MongoDB & Node.JS Connectedπ]*************************//
mongoose
  .connect(
    "mongodb+srv://Dharmendra:dkyadav123@cluster0.kq9bu.mongodb.net/productsManagementGroup43",
    {
      useNewUrlParser: true,
    }
  )
  .then((result) => console.log("Hello Mr Dkyadav MongoDb is connected π"))
  .catch((err) => console.log(err));

//**************************[πIt is Global Api'sπ]*****************************//
app.use("/", router);

//******************************[πPort Createdπ]*******************************//
app.listen(process.env.PORT || 3001, function () {
  console.log("Express app running on port π " + (process.env.PORT || 3001));
});

//ππππππππ[Thank You Mr Dkyadav Index-File End]πππππππππ//
