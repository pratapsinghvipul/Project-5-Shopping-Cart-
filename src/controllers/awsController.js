//👇👇👇👇👇👇👇👇👇[Hello Mr Dk it's AWS-Controller]👇👇👇👇👇👇👇👇👇//

const aws = require("aws-sdk");

//*****************************[👇aws configuration👇]***************************//
aws.config.update({
  accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
  secretAccessKey: "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",
  region: "ap-south-1",
});

//***************************[👇upload files on AWS-S3👇]************************//
let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    let uploadParams = {
      ACL: "public-read",
      Bucket: "classroom-training-bucket",
      Key: "Dkyadav/" + file.originalname,
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ error: err });
      }
      // console.log(data);
      console.log("file uploaded succesfully");
      return resolve(data.Location);
    });
  });
};

//**************************[All-Function's🐕 Exports]****************************//
module.exports = { uploadFile };

//👌👌👌👌👌👌👌[Thank You Mr Dkyadav AWS-Controller End]👌👌👌👌👌👌👌👌//
