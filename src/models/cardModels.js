const { mongoose } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

//*************************[πCart-Schema-Creationπ]****************************//
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

//***************************[πCart Creation & Exportsπ]***********************//
module.exports = mongoose.model("Cart", cartSchema);

//ππππππππ[Thank You Mr Dkyadav Cart-Schema End]πππππππππ//
