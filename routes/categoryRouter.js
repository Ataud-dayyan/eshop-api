const express = require("express");
const {Category} = require("../model/Category");

const router = express.Router();

//post method
router.post("/", async (req, res) =>{
    const { name, icon, color } = req.body;

    const categoryFound = await Category.findOne({ name,  });
    if(categoryFound){
        res.status(404).send(`${name} Category already exist`)
    }

    let category = new Category({
        name,
        icon,
        color,
    });
    category = await category.save();
    if (!category) {
        res.status(404).send("Category cannot send.");
    }
    res.send(category);
})

//get all categories
router.get("/", async (req, res) =>{
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(404).json({success: false});
    }
    res.send(categoryList);
});

//get single categories
router.get("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404).send("The category with ID is not found");
    }
    res.send(category);
});

//update categories
router.put("/:id", async (req, res) => {
    const {name, icon, color} = req.body;
    
    const categoryFound = await Category.findOne ({name});
    if (categoryFound) {
        res.status(404).send(`${name} Category already exist`);
    }

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name, 
            icon,
            color
        },
        { new: true }
    );
    if (!category) {
        res.status(404).send("The category with ID is not found");
    }
    res.send(category);
});

//Delete category
router.delete("/:id", async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) {
        res.status(404).send("The category with ID is not found");
    }
    res.send("Category deleted succesfully");
});

module.exports = router