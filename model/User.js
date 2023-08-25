//mongoose schema
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String, 
        require: true,
    },
    passwordHash: {
        type: String, 
        require: true,
    },
    street: {
        type: String, 
        default: "",
    },
    apartment: {
        type: String, 
        default: "",
    },
    city: {
        type: String, 
        default: "",
    },
    zip: {
        type: String, 
        default: "",
    },
    country: {
        type: String, 
        default: "",
    },
    phone: {
        type: Number, 
        require: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
userSchema.set("toJSON", {
    virtuals: true,
});

//mongoose model
const User = mongoose.model("User", userSchema);

module.exports = {
    User,
};
