const express = require("express");
const { Order } = require("../model/Order");
const { OrderItem } = require("../model/Order-items");
const isLogin = require("../middleware/isLogin");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.get("/", isLogin, isAdmin, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  if (!orderList) {
    res.status(500).json({ message: false });
  }
  res.send(orderList);
});

//post method
router.post("/", async (req, res) => {
  const {
    orderItems,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice,
    user,
  } = req.body;
  const orderItemsIds = Promise.all(
    orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemsIdResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalSum = orderItem.product.price * orderItem.quantity;
      return totalSum;
    })
  );
  const totalSum = totalPrices.reduce((a, b) => a + b, 0);
  let order = new Order({
    orderItems: orderItemsIdResolved,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice: totalSum,
    user,
  });
  order = await order.save();
  if (!order) {
    res.status(404).send("Order cannot be created.");
  }

  res.send(order);
});

//count order
router.get("/count/order", async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
});
// get single order
router.get("/get/userorders/:userId", isLogin, isAdmin, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userId })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  if (!userOrderList) {
    res.status(500).json({ message: false });
  }
  res.send(userOrderList);
});

module.exports = router;
