const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    }, 
    icon: {
        type: String,
    },
    color: {
        type: String,
    },
})

//mongoose model
const Category = mongoose.model("Category", categorySchema);

module.exports = {
    Category,
}