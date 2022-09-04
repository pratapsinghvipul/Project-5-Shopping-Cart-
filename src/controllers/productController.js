//👇👇👇👇👇👇👇👇[Hello Mr Dk it's Product-Controller]👇👇👇👇👇👇👇👇👇//

const productModel = require("../models/productModels");
const { uploadFile } = require("./awsController");

//********************[👇Import Validation Functio's👇]**************************//
const {
  isValidObjectId,
  isValidRequestBody,
  isValidImage,
  isValid2,
  isValid,
  isValidSize,
  isValidPrice,
  isValidBoolean,
  isValidNum,
  isSize,
} = require("../validators/valitor");

//************************[👇Create Product Function's👇]************************//
const createProduct = async function (req, res) {
  try {
    //const data = req.body
    const data = JSON.parse(JSON.stringify(req.body));

    // first Check request body is coming or not
    if (!isValidRequestBody(data)) {
      res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide Product details",
      });
      return;
    }

    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = data; //Object Deatructing

    //Check Title is comming or not
    if (!isValid(title)) {
      res.status(400).send({ status: false, message: "Title is mandatory" });
      return;
    }

    //Check Title Validation
    if (!isValid2(title)) {
      res
        .status(400)
        .send({ status: false, message: "Title is not valid string" });
      return;
    }

    //DB call in  Title  alredy availabe or not
    const isExistTitle = await productModel.findOne({ title: title });
    if (isExistTitle) {
      res
        .status(400)
        .send({ status: false, message: "This title belong to other Product" });
      return;
    }

    //Check Description is comming or not
    if (!isValid(description)) {
      res
        .status(400)
        .send({ status: false, message: "Description is mandatory" });
      return;
    }

    //Check Description Validation is valid or not
    if (!isValid2(description)) {
      res
        .status(400)
        .send({ status: false, message: "Description is not valid string" });
      return;
    }

    //Check Price is comming or not
    if (!isValid(price)) {
      res.status(400).send({ status: false, message: "Price is mandatory" });
      return;
    }

    //Check Price validtion Correct or not
    if (!isValidPrice(price) || typeof parseInt(price) !== "number") {
      res
        .status(400)
        .send({ status: false, message: "Price is not valid Number" });
      return;
    }

    //Check INR
    if (!isValid(currencyId)) {
      // res
      //   .status(400)
      //   .send({ status: false, message: "Currency Id is mandatory" });
      // return;
      currencyId = "INR";
    }

    //Check currency Id Should be INR
    if (currencyId !== "INR") {
      res
        .status(400)
        .send({ status: false, message: "Currency Id should be INR" });
      return;
    }

    //Check Currency is comming or not
    if (!isValid(currencyFormat)) {
      // res
      //   .status(400)
      //   .send({ status: false, message: "Currency format is mandatory" });
      // return;
      currencyFormat = "₹";
    }

    //Check Currency Sybol Correct or not
    if (currencyFormat !== "₹") {
      res
        .status(400)
        .send({ status: false, message: "Currency Symbol should be ₹" });
      return;
    }

    //Check Shipping Correct or not
    //console.log(typeof isFreeShipping);
    if (isFreeShipping && !isValidBoolean(isFreeShipping)) {
      res
        .status(400)
        .send({ status: false, message: "free shipping type is not correct" });
      return;
    }

    // Extracting file from request's files and validating and uploading in aws-s3
    let files = req.files;
    if (!isValid(files)) {
      res
        .status(400)
        .send({ status: false, message: "product image file is mandatory" });
      return;
    }
    let productImage = "";
    if (files && files.length > 0) {
      if (!isValidImage(files[0].originalname)) {
        return res
          .status(400)
          .send({ status: false, message: "File extension not supported!" });
      }
      let uploadedFileURL = await uploadFile(files[0]);
      productImage = uploadedFileURL;
      //res.status(201).send({msg: 'file uploaded succesfully', data: uploadedFileURL})
    } else {
      return res.status(400).send({ status: false, message: "No file found" });
    }

    //Check Style Correct or not
    if (style && !isValid2(style)) {
      res
        .status(400)
        .send({ status: false, message: "Style type is not correct" });
      return;
    }

    if (availableSizes && Array.isArray(availableSizes)) {
      return res
        .status(400)
        .send({ status: false, data: "Sizes is must be an Array" });
    }
    //arraSizes: [type: enum]

    if (availableSizes && !isValidSize(availableSizes)) {
      res.status(400).send({
        status: false,
        message: `Size Must be of these values ---> "S", "XS","M","X", "L","XXL", "XL" `,
      });
      return;
    }
    if (availableSizes) {
      let sizes = availableSizes.split(" ").map((x) => x.trim());
      console.log(sizes);
      sizes.forEach((size) => {
        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size)) {
          return res.status(400).send({
            status: false,
            msg: `Available sizes must be among ${[
              "S",
              "XS",
              "M",
              "X",
              "L",
              "XXL",
              "XL",
            ]} and this format S M L X XL XXL XS`,
          });
        }
        //productDetails["availableSizes"] = sizes;
        availableSizes = sizes;
      });
    }
    //if (availableSizes) availableSizes = isValidSize(availableSizes);

    if (installments && !isValidNum(installments)) {
      res
        .status(400)
        .send({ status: false, message: "please enter valid installments" });
      return;
    }

    let finalData = {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      productImage: productImage,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    }; // Object Destructing

    //After Validation Pass so Create Product Created
    let productData = await productModel.create(finalData);
    res.status(201).send({
      status: true,
      message: "Success",
      data: productData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: err.message });
  }
};

//************************[👇Get-Product Function's👇]***************************//
const getProduct = async function (req, res) {
  try {
    const requestBody = req.query;

    // Object Destructing
    let {
      size,
      name,
      priceGreaterThan,
      priceLessThan,
      priceSort,
      ...remaining
    } = requestBody;

    // check valid filters or not
    if (isValidRequestBody(remaining)) {
      return res.status(400).send({
        status: false,
        message:
          "size, name, priceGreaterThan, priceLessThan, --> only these filters are allowed",
      });
    }

    //Empty object declaration
    let filterQuery = {};

    //Check size is Available or not this type
    if (size) {
      if (size && !isSize(size)) {
        res.status(400).send({
          status: false,
          message: `Size Must be of these values ---> "S", "XS","M","X", "L","XXL", "XL" `,
        });
        return;
      }
      size = size.toUpperCase(); //Convert UpperCase
      filterQuery.availableSizes = { $in: size };
    }

    //Check name is Valid or not
    if (name) {
      if (name && !isValid2(name)) {
        res
          .status(400)
          .send({ status: false, message: "Name is not valid string" });
        return;
      }
      filterQuery.title = { $regex: name, $options: "i" };
    }

    if (priceGreaterThan || priceLessThan) {
      let filter = {}; //Empty Object declaration
      if (priceGreaterThan) {
        if (priceGreaterThan && !isValidNum(priceGreaterThan)) {
          res.status(400).send({
            status: false,
            message: "please enter valid greater than Price....",
          });
          return;
        }
        filter.$gt = priceGreaterThan;
      }

      //Price Logic
      if (priceLessThan) {
        if (priceLessThan && !isValidNum(priceLessThan)) {
          res.status(400).send({
            status: false,
            message: "please enter valid less than Price!!!!",
          });
          return;
        }
        filter.$lt = priceLessThan;
      }
      filterQuery.price = filter;
    }

    let sortFilter = {}; //Empty object declaration
    sortFilter.price = 1;

    if (priceSort) {
      if (priceSort && !["1", "-1"].includes(priceSort)) {
        res.status(400).send({
          status: false,
          message: "please enter valid sorting filter ",
        });
        return;
      }
      sortFilter.price = parseInt(priceSort);
    }

    // Set property called isDeleted to false
    let condition = { isDeleted: false };
    let data = Object.assign(filterQuery, condition);
    console.log(data);

    let allProducts = await productModel
      .find(data)
      .collation({ locale: "en" })
      .sort(sortFilter);

    if (!allProducts.length) {
      return res
        .status(200)
        .send({ status: false, msg: "Product not found Or Already Deleted" });
    }
    // Send all Products in response
    return res
      .status(200)
      .send({ status: true, message: "Success", data: allProducts });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//*********************[👇Get ProductById Function's👇]**************************//
const getProductById = async function (req, res) {
  try {
    const productId = req.params.productId;

    //Check data is Comming or not
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: " invalid productId" });
    }

    //DB call in Product-Id
    let product = await productModel.findById(productId);
    //console.log(product)

    if (!product || product.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "Product not found or Already deleted",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "Product", data: product });
  } catch (err) {
    // console.log(err)
    res.status(500).send({ status: false, message: err.message });
  }
};

//**********************[👇Update Product Function's👇]**************************//
const updateProduct = async function (req, res) {
  try {
    let productId = req.params.productId;

    // if productId is not a valid ObjectId
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "productId is not a valid ObjectId" });
    }

    //DB call in Product-Id
    let productDoc = await productModel.findById(productId);

    // if productId does not exist
    if (!productDoc || productDoc.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "product does not exist with this productId",
      });
    }

    // data to be updated
    let data = { ...req.body }; // req.body does not have a prototype; creating a new object (prototype object associates by default)

    // if no data to be updated
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "No data to be updated!" });
    }

    let {
      title,
      description,
      price,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = data; //Object Destrcting

    const updateProductData = {}; //Empty Object Declaration

    // if updating "title"
    if (data.hasOwnProperty("title")) {
      if (!isValid2(title)) {
        return res
          .status(400)
          .send({ status: false, message: "title is invalid" });
      }
      updateProductData.title = data.title;
    }

    // Check Duplicate title is present or not
    let duplicateTitle = await productModel.findOne({
      title: title,
      isDeleted: false,
    });

    //Check Title is availble not not
    if (duplicateTitle) {
      return res.status(400).send({
        status: false,
        message: `Product Already Exists with this title`,
      });
    }

    // if updating "description"
    if (data.hasOwnProperty("description")) {
      if (!isValid2(description)) {
        return res
          .status(400)
          .send({ status: false, message: "description is invalid" });
      }
      updateProductData.description = data.description;
    }

    // if updating "price"
    if (data.hasOwnProperty("price")) {
      if (!isValidPrice(price)) {
        return res
          .status(400)
          .send({ status: false, message: "price is invlid" });
      }
      updateProductData.price = price;
    }

    // if updating "isFreeShipping"
    if (data.hasOwnProperty("isFreeShipping")) {
      if (!isValidBoolean(isFreeShipping)) {
        return res
          .status(400)
          .send({ status: false, message: "isFreeShipping has invalid value" });
      }
      updateProductData.isFreeShipping = data.isFreeShipping;
    }

    let files = req.files; //files comming in req-body

    // if updating productImage
    if (files.length) {
      if (!isValidImage(files[0].originalname)) {
        return res
          .status(400)
          .send({ status: false, message: "File extension not supported!" });
      }
      let uploadedFileURL = await uploadFile(files[0]);
      updateProductData.productImage = uploadedFileURL;
    }

    // if updating "style"
    if (data.hasOwnProperty("style")) {
      if (!isValid2(style)) {
        return res
          .status(400)
          .send({ status: false, message: "style is invalid" });
      }
      updateProductData.style = data.style;
    }

   // if updating "availableSizes"
   let product = await productModel.findById({_id:productId}).select({_id:0, availableSizes:1})
   let existSizes = product.availableSizes
   //console.log("alreday present sizes "+ existSizes)
   if (data.hasOwnProperty("availableSizes")) {
     if (availableSizes) {
       let sizes = availableSizes.split(" ").map((x) => x.trim());
       //console.log(sizes)
       sizes.forEach((size) => {
         if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size)) {
           return res
             .status(400)
             .send({
               status: false,
               msg: `Available sizes must be among ${[
                 "S",
                 "XS",
                 "M",
                 "X",
                 "L",
                 "XXL",
                 "XL",
               ]} and this format S M L X XL XXL XS`,
             });
         }
         //productDetails["availableSizes"] = sizes;
         sizes.forEach((size)=>{
           if(!existSizes.includes(size)){
             existSizes.push(size)
           }else{
             
           }
         })
         updateProductData.availableSizes=existSizes
       });
      
     }
   }
      // if updating "installments"
      if (data.hasOwnProperty("installments")) {
        if (!isValidNum(installments)) {
          return res
            .status(400)
            .send({ status: false, message: "installment(s) is invalid" });
        }
        updateProductData.installments = data.installments;
      }

      // "isDeleted" shouldn't be updated
      if (data.hasOwnProperty("isDeleted")) {
        return res.status(400).send({
          status: false,
          message: "To delete this product, hit the delete API",
        });
      }

      // updating document
      let updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId },
        updateProductData,
        { new: true }
      );

      res.status(200).send({
        status: true,
        message: "Product details updated",
        data: updatedProduct,
      });
    
  } catch (err) {
    // console.log(err)
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//*********************[👇Delete Product Function's👇]***************************//
const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid productId" });
    }

    //DB call in Product-Id
    let product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (product == null) {
      return res.status(404).send({
        status: false,
        message: "Product document does not exist or Already deleted",
      });
    }

    //DB call & update and convert object to string
    let deleteProduct = await productModel.findOneAndUpdate(
      { _id: productId },
      { $set: { isDeleted: true, deletedAt: new Date().toISOString() } },
      { new: true, upsert: true }
    );
    return res.status(200).send({
      status: true,
      message: "Product document deleted successefully",
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//******************[👇All Product Function's Are Publically👇]******************//
module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProductById,
};

//👌👌👌👌👌👌[Thank You Mr Dkyadav Product-Controller End]👌👌👌👌👌👌👌👌//
