//👇👇👇👇👇👇👇👇👇[Hello Mr Dk it's Cart-Controller]👇👇👇👇👇👇👇👇👇//

const productModel = require("../models/productModels");
const userModel = require("../models/userModels");
const cartModel = require("../models/cardModels");

//*******************************[Import's Validation👇]**************************//
const {
  isValidObjectId,
  isValidRequestBody,
  isValid,
} = require("../validators/valitor");

//*************************[👇Add To Cart Function's👇]**************************//
const addToCart = async function (req, res) {
  try {
    const userId = req.params.userId;
    const tokenUserId = req.userId;
    const data = req.body;
    let { cartId, productId, quantity } = data;

    //Check User-Id valid or not
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ msg: "The UserId is Not valid" });
    }

    //DB call in User-Id
    let checkUser = await userModel.findById(userId);
    if (!checkUser) {
      return res.status(404).send({ msg: "User Not Found" });
    }

    //Check Authorization
    if (checkUser._id.toString() != tokenUserId) {
      res
        .status(403)
        .send({ status: false, message: "You Are Not Authorized" });
      return;
    }

    //Check Item Cart Comming or not
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Add Item In Cart" });
    }

    //Check Procduct-Id is comming or not
    if (!isValid(productId)) {
      return res.status(400).send({ msg: "Enter the productId" });
    }

    //Check Product-Id valid or not
    if (!isValidObjectId(productId)) {
      return res.status(400).send({ msg: "The productId is Not valid" });
    }

    //Check quantity is Comming or not
    if (quantity) {
      if (!isValid(quantity)) {
        return res.status(400).send({ msg: "Enter the quantity" });
      }

      if (!quantity > 0) {
        return res.status(400).send({ msg: "Quantity can't be 0 or -ve" });
      }
    }
    if (!data?.quantity) quantity = 1;

    //DB call in product-Id
    const findProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!findProduct) {
      return res
        .status(404)
        .send({ status: false, message: `Product doesn't exist` });
    }

    //DB call in User-Id
    const findCartOfUser = await cartModel.findOne({ userId: userId });

    if (!findCartOfUser) {
      /*cart creating for new user */

      const cartData = {
        userId: userId,
        items: [
          {
            productId: productId,
            quantity: quantity,
          },
        ],
        totalPrice: findProduct.price * quantity,
        totalItems: 1,
      };

      //After Validation Pass so Create Cart-Succssfully
      const createCart = await cartModel.create(cartData);
      return res.status(201).send({
        status: true,
        message: `Success`,
        data: createCart,
      });
    }

    //Check Cart-Id is Comming or not
    if (cartId) {
      /*if the cart id is given */
      if (!isValid(cartId)) {
        return res.status(400).send({ msg: "Enter the cartId" });
      }

      // DB call in Cart-Id
      let checkCart = await cartModel.findById(cartId);
      if (!checkCart) {
        return res.status(404).send({ msg: "cart Not Found" });
      }
      if (cartId != findCartOfUser._id.toString()) {
        return res.status(200).send({
          status: true,
          message: `This Cart not belong to the userID ${userId}`,
        });
      }
    }

    //Cart logic
    if (findCartOfUser) {
      /*if cart is exist */

      let price = findCartOfUser.totalPrice + quantity * findProduct.price;
      let cartItems = findCartOfUser.items;

      for (let item of cartItems) {
        if (item.productId.toString() === productId) {
          item.quantity += quantity;

          let updatedCart = {
            items: cartItems,
            totalPrice: price,
            totalItems: cartItems.length,
          };

          let saveCartDetails = await cartModel.findOneAndUpdate(
            { _id: findCartOfUser._id },
            updatedCart,
            { new: true }
          );

          return res.status(200).send({
            status: true,
            message: `Success`,
            data: saveCartDetails,
          });
        }
      }
      cartItems.push({ productId: productId, quantity: quantity }); //storing the updated prices and quantity to the newly created array.

      let updatedCart = {
        items: cartItems,
        totalPrice: price,
        totalItems: cartItems.length,
      };
      let saveCartDetails = await cartModel.findOneAndUpdate(
        { _id: findCartOfUser._id },
        updatedCart,
        { new: true }
      );

      return res.status(200).send({
        status: true,
        message: `Success`,
        data: saveCartDetails,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

//****************************[👇Update Cart Function's👇]***********************//
const updateCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    let updateData = req.body;
    const tokenUserId = req.userId;

    //Check user-Id valid or not
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, msg: "The UserId is Not valid" });
    }

    //DB call in user-Id
    let checkUser = await userModel.findById(userId);
    if (!checkUser) {
      return res.status(404).send({ status: false, msg: "User Not Found" });
    }

    //Check Authorization
    if (checkUser._id.toString() != tokenUserId) {
      res
        .status(403)
        .send({ status: false, message: "You Are Not Authorized" });
      return;
    }

    //Object Destructing
    let { cartId, productId, removeProduct } = updateData;

    //Check Update-Cart Updatting cart comming or not
    if (!isValidRequestBody(updateData)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Add Item to Update Cart" });
    }

    //Check cart-Id Comming or not
    if (!isValid(cartId)) {
      return res.status(400).send({ msg: "Enter the cartId" });
    }

    //Check cart-Id valid or not
    if (!isValidObjectId(cartId)) {
      return res
        .status(400)
        .send({ status: false, msg: "cartId is Not valid" });
    }

    //DB call in cart-Id & user-Id
    let checkCart = await cartModel.findOne({ _id: cartId, userId: userId });
    if (!checkCart) {
      return res.status(404).send({ status: false, msg: "cart Not Found" });
    }

    //Check product-Id is comming or not
    if (!isValid(productId)) {
      return res.status(400).send({ msg: "Enter the productId" });
    }

    //Check product-Id valid or not
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, msg: "productId is Not valid" });
    }

    //DB call in Product-Id
    let checkProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    //Check product is avalable or not in DB
    if (!checkProduct) {
      return res.status(404).send({ status: false, msg: "product Not Found" });
    }

    //Check removedproduct enter only 0 or 1 (0==>false,1==>true)
    if (!isValid(removeProduct)) {
      return res.status(400).send({ msg: "Enter the 0 or 1" });
    }

    //Check valid number or not
    if (isNaN(Number(removeProduct))) {
      return res.status(400).send({
        status: false,
        message: `removeProduct should be a valid number either 0 or 1`,
      });
    }

    if (!(removeProduct === 0 || removeProduct === 1)) {
      return res
        .status(400)
        .send({ status: false, message: "removeProduct should be 0 or 1" });
    }

    let checkQuantity = checkCart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!checkQuantity)
      return res.status(400).send({
        status: false,
        message: `The product is already remove with ${productId} this productId`,
      });

    if (removeProduct === 0) {
      let totalAmount =
        checkCart.totalPrice - checkProduct.price * checkQuantity.quantity;
      let updatedCart = await cartModel.findOneAndUpdate(
        { _id: cartId },
        {
          $pull: { items: { productId: productId } },
          $set: { totalPrice: totalAmount },
          $inc: { totalItems: -1 },
        },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        msg: "Success",
        data: updatedCart,
      });
    }

    if (removeProduct === 1) {
      let totalAmount = checkCart.totalPrice - checkProduct.price;
      let itemsArr = checkCart.items;

      for (let item of itemsArr) {
        if (item.productId.toString() == productId) {
          item.quantity = item.quantity - 1;
          if (checkQuantity.quantity > 0) {
            let updatedCart = await cartModel.findOneAndUpdate(
              { _id: cartId },
              { $set: { totalPrice: totalAmount, items: itemsArr } },
              { new: true }
            );
            return res.status(200).send({
              status: true,
              msg: "Success",
              data: updatedCart,
            });
          }
        }
      }

      //After Validation Pass so created cart
      let updatedCart = await cartModel.findOneAndUpdate(
        { _id: cartId },
        {
          $pull: { items: { productId: productId } },
          $set: { totalPrice: totalAmount },
          $inc: { totalItems: -1 },
        },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        msg: "Success",
        data: updatedCart,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

//****************************[👇Get Cart Function's👇]**************************//
const getCart = async function (req, res) {
  try {
    const userId = req.params.userId;
    let tokenUserId = req.userId;

    //Check user-Id valid or not
    if (!isValidObjectId(userId)) {
      res.status(400).send({ status: false, msg: "The UserId is Not valid" });
    }

    //DB call in User-Id
    let checkUser = await userModel.findById(userId);
    if (!checkUser) {
      res.status(404).send({ status: false, msg: "User Not Found" });
    }

    //Checking Authorization 🚨
    if (checkUser._id.toString() != tokenUserId) {
      res
        .status(403)
        .send({ status: false, message: "You Are Not Authorized" });
      return;
    }

    //DB call in user-Id
    const checkCart = await cartModel.findOne({ userId: userId });

    //Check cart is available or not in DB
    if (!checkCart) {
      return res.status(404).send({ status: false, message: "cart not found" });
    }

    //After validation so cart-fetch successfully
    return res.status(200).send({
      status: true,
      message: "Success",
      data: checkCart,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//**************************[👇Delete Cart Function's👇]*************************//
const deleteCart = async function (req, res) {
  try {
    const userId = req.params.userId;
    let userIdFromToken = req.userId;

    //Check user-Id valid or not
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid userId" });
    }

    //DB call in User-Id
    const checkUser = await userModel.findById(userId);
    if (!checkUser) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    //Check The Authorization
    if (checkUser._id.toString() != userIdFromToken) {
      return res
        .status(403)
        .send({ status: false, message: `You are Not Authorized` });
    }

    //DB call in user-Id
    const findCart = await cartModel.findOne({ userId });
    if (!findCart) {
      return res.status(400).send({ status: false, message: "cart not found" });
    }

    //After Validation pass so cart-delted successfully
    const deleteCart = await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0, totalItems: 0 } }
    );

    return res
      .status(204)
      .send({ status: true, message: "Success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

//***********************[👇Export's All Cart Function's👇]***********************//
module.exports = { addToCart, updateCart, getCart, deleteCart };

//👌👌👌👌👌👌👌[Thank You Mr Dkyadav Cart-Controller End]👌👌👌👌👌👌👌👌//
