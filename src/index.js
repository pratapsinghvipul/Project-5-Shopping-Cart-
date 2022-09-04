const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const router = require("./routers/route");
const multer = require("multer");

app.use(bodyparser.json()); //👈ConvertObject to JSON Form
app.use(multer().any());

//************************[MongoDB & Node.JS Connected🔗]*************************//
mongoose
  .connect(
    "mongodb+srv://Dharmendra:dkyadav123@cluster0.kq9bu.mongodb.net/productsManagementGroup43",
    {
      useNewUrlParser: true,
    }
  )
  .then((result) => console.log("Hello Mr Dkyadav MongoDb is connected 👌"))
  .catch((err) => console.log(err));

//**************************[👇It is Global Api's👇]*****************************//
app.use("/", router);

//******************************[👇Port Created👇]*******************************//
app.listen(process.env.PORT || 3001, function () {
  console.log("Express app running on port 🏃 " + (process.env.PORT || 3001));
});

//👌👌👌👌👌👌👌👌[Thank You Mr Dkyadav Index-File End]👌👌👌👌👌👌👌👌👌//
