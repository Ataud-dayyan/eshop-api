//mongoose schema
const mongoose = require("mongoose");
// const { Product } = require("./Product");

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        require: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
});

//mongoose model
const OrderItem = mongoose.model("OrderItem", orderItemSchema);
 module.exports = {
    OrderItem,
 }