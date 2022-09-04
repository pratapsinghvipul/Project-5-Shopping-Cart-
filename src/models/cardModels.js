const { mongoose } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

//*************************[👇Cart-Schema-Creation👇]****************************//
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        _id: false,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      requied: true,
    },
  },
  { timestamp: true }
);

//***************************[👇Cart Creation & Exports👇]***********************//
module.exports = mongoose.model("Cart", cartSchema);

//👌👌👌👌👌👌👌👌[Thank You Mr Dkyadav Cart-Schema End]👌👌👌👌👌👌👌👌👌//
