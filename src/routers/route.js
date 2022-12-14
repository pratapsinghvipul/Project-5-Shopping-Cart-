const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cardController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const middleware = require("../middlewares/auth");

//*******************************[๐User's-Api's๐]******************************//
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get(
  "/user/:userId/profile",
  middleware.authentication,
  userController.getProfile
);
router.put(
  "/user/:userId/profile",
  middleware.authentication,
  userController.updateUser
);
//***************************************[๐]*************************************//

//*****************************[๐Product's Api's๐]*****************************//
router.post("/products", productController.createProduct);
//router.post("/products", productController.productCreation);
router.get("/products", productController.getProduct);
router.get("/products/:productId", productController.getProductById);
router.put("/products/:productId", productController.updateProduct);
router.delete("/products/:productId", productController.deleteProductById);
//***************************************[๐]*************************************//

//********************************[๐Cart's Api's๐]*****************************//
router.post(
  "/users/:userId/cart",
  middleware.authentication,
  cardController.addToCart
);
router.put(
  "/users/:userId/cart",
  middleware.authentication,
  cardController.updateCart
);

router.get(
  "/users/:userId/cart",
  middleware.authentication,
  cardController.getCart
);
router.delete(
  "/users/:userId/cart",
  middleware.authentication,
  cardController.deleteCart
);
//***************************************[๐]*************************************//

//*****************************[๐Order's Api's๐]*******************************//
router.post(
  "/users/:userId/orders",
  middleware.authentication,
  middleware.authorisation,
  orderController.createOrder
);
router.put(
  "/users/:userId/orders",
  middleware.authentication,
  middleware.authorisation,
  orderController.updateOrder
);
//***************************************[๐]*************************************//

//*************************[๐Invalid Or Wrong Url Api's๐]**********************//
//it is a optional
// if api is invalid OR wrong URL
router.all("/*", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "The api you requested is not available" });
});
//***************************************[๐]*************************************//

module.exports = router;
