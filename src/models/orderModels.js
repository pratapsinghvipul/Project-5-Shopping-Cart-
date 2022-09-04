const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

//*************************[👇Order Model Creation👇]****************************//
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
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
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },

    cancellable: {
      type: Boolean,
      default: "true",
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "cancelled"],
    },

    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

//**********************[👇Connection Creation & export model👇]*****************//
module.exports = mongoose.model("Order", orderSchema);

//👌👌👌👌👌👌👌👌[Thank You Mr Dkyadav Order-Schema End]👌👌👌👌👌👌👌👌//
