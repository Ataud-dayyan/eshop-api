//mongoose schema
const mongoose = require("mongoose")
const productSchema= mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String, 
        require: true,
    },
    richDescription: {
        type: String, 
        default: "",
    },
    image: {
        type: String, 
        default: "",
    },
    images: [
        {
            type: String,
        }
    ],
    brand: {
        type: String, 
        default: "",
    },
    price: {
        type: Number, 
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category",
    },
    countInStock: {
        type: Number, 
        require: true,
        min: 0,
        max: 255,
    },
    rating: {
        type: Number,
        default: 0,
    },
    isFeature: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date, 
        default: Date.now(),
    },
});

productSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
productSchema.set("toJSON", {
    virtuals: true,
});

//mongoose model
const Product = mongoose.model("Product", productSchema);

module.exports = {
    Product,
}