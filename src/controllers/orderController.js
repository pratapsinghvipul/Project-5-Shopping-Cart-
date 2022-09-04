//👇👇👇👇👇👇👇👇👇[Hello Mr Dk it's Order-Controller]👇👇👇👇👇👇👇👇👇//

const orderModel = require("../models/orderModels");
const cartModel = require("../models/cardModels");
const userModel = require("../models/userModels");
const validate = require("../validators/valitor");
const {
  isValidObjectId,
  isValidRequestBody,
} = require("../validators/valitor");

//**********************[👇Order Create Function's👇]****************************//
const createOrder = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.params.userId;

    let { cartId, cancellable, status } = data; //object destructing

    //Check Data is comming or not
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Oops you forgot to enter details" });
    }

    //Check user-Id  is valid or not
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "UsertId is Not Valid" });
    }
    //DB call in userId
    const findUser = await userModel.findById({ _id: userId });
    if (!findUser) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    //Check CartId is comming or not
    if (!cartId) {
      return res
        .status(400)
        .send({ status: false, message: "cartId is Required" });
    }

    //Check card-Id is valid or not
    if (!isValidObjectId(cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "cartId is Not Valid" });
    }

    //DB call in card-Id
    let cartExist = await cartModel.findById({ _id: cartId });
    if (!cartExist) {
      return res.status(404).send({ status: false, message: "Cart not found" });
    }

    //Check card-Id match or not
    if (cartExist.userId != userId) {
      return res
        .status(400)
        .send({ status: false, message: "Cart id and userId are not matched" });
    }

    //Check cancellable true or false
    if (cancellable) {
      if (typeof cancellable != "boolean") {
        return res.status(400).send({
          status: false,
          message: "Cancellable should be true or false",
        });
      }
    }

    //Check status
    if (status) {
      let validStatus = ["pending", "completed", "canceled"];
      if (!validStatus.includes(status)) {
        return res.status(400).send({
          status: false,
          message: `status should be one of this :-"pending", "completed", "canceled"`,
        });
      }
      if (status == "completed" || status == "canceled") {
        return res.status(400).send({
          status: false,
          message: "status should be  pending while creating order",
        });
      }
    }
    let newQuantity = 0;
    for (let i = 0; i < cartExist.items.length; i++) {
      newQuantity = newQuantity + cartExist.items[i].quantity;
    }
    const newOrder = {
      userId: userId,
      items: cartExist.items,
      totalPrice: cartExist.totalPrice,
      totalItems: cartExist.totalItems,
      totalQuantity: newQuantity,
      cancellable,
      status,
    }; //Destructing object

    //After validation check successfully so create Order created
    const order = await orderModel.create(newOrder);

    await cartModel.findOneAndUpdate(
      { _id: cartId, userId: userId },
      { items: [], totalPrice: 0, totalItems: 0 }
    );
    return res.status(201).send({
      status: true,
      message: "Success",
      data: order,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, message: err.message });
  }
};

//**********************[👇Order Update Function's👇]****************************//
const updateOrder = async (req, res) => {
  let userId = req.params.userId;
  let data = req.body;
  let { orderId, status } = data; //Object Destruting

  //Check body data comming or not
  if (!isValidRequestBody(data)) {
    return res
      .status(400)
      .send({ status: false, message: "Oops you forgot to enter details" });
  }

  //Check user-Id valid or not
  if (!isValidObjectId(userId)) {
    return res
      .status(400)
      .send({ status: false, message: "userId is Not Valid" });
  }

  //DB call in user-Id
  let findUser = await userModel.findById({ _id: userId });
  if (!findUser) {
    return res.status(404).send({ status: false, message: "User not found" });
  }

  //Check order-Id comming or not
  if (!orderId) {
    return res
      .status(400)
      .send({ status: false, message: "OrderId is required to update order" });
  }

  //Check oreder-Id valid or not
  if (!isValidObjectId(orderId)) {
    return res
      .status(400)
      .send({ status: false, message: "orderId is Not Valid" });
  }

  //Db call in order-Id
  let findOrder = await orderModel.findOne({ _id: orderId, isDeleted: false });

  //Check order-Id valid or not
  if (!findOrder) {
    return res.status(404).send({ status: false, message: "Order not found" });
  }

  //so check user-Id & Order-Id valid or not
  if (findOrder.userId != userId) {
    return res.status(400).send({
      status: false,
      message: "Make sure UserId and OrderId are correct",
    });
  }

  //Check status is comming or not
  if (!status) {
    return res
      .status(400)
      .send({ status: false, message: "status is required to update order" });
  }
  let validStatus = ["pending", "completed", "canceled"];
  if (!validStatus.includes(status)) {
    return res.status(400).send({
      status: false,
      message: `status should be one of this :-"pending", "completed", "canceled"`,
    });
  }

  //Check order cancel or not
  if (findOrder.cancellable == false) {
    return res
      .status(400)
      .send({ status: false, message: "This order is not cancellable" });
  }

  //After validation so Update & Cancallable Order
  const updated = await orderModel.findOneAndUpdate(
    { _id: orderId },
    { status: status },
    { new: true }
  );
  return res.status(200).send({
    status: true,
    message: "Success",
    data: updated,
  });
};

//const updatedOrder = await orderModel.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true }).select({isDeleted:0})

//**********************[👇Order's Function's Expoerts👇]************************//
module.exports = { createOrder, updateOrder };
//👌👌👌👌👌👌👌[Thank You Mr Dkyadav Order-Controller End]👌👌👌👌👌👌👌👌//
