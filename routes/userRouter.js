const express = require("express");
const { User } = require("../model/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../helper/generateToken")
const isLogin = require("../middleware/isLogin");
const getTokenFromHeader = require("../helper/getTokenFromHeader");
const appErr = require("../helper/appErr");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

//get method
router.get("/", isLogin, isAdmin, async (req, res) => {
    const userList = await User.find();
    res.send(userList);
});

//post method
router.post("/register", async (req, res, next) => {
    const {
        name,
        email,
        phone,
        isAdmin,
        street,
        city, 
        country,
        zip,
        passwordHash,
        apartment,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    //verify
    const userFound = await User.findOne({ name });
    if (userFound) {
        return next(appErr(`${name} User already exist`, 404));
    }
    let user = new User({
        name,
        email,
        phone,
        isAdmin,
        street,
        city,
        country,
        zip,
        passwordHash: bcrypt.hashSync(passwordHash, salt),
        apartment,
    });
    user = await user.save();
    if(!user){
        return next(appErr("User cannot send.", 404));
        // res.status(404).send("User cannot send.");
    }
    res.send(user);
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });
    if (!userFound) {
        res.status(404).json({
            success: false,
            message: "Invalid username or password provided"
        });
    } 
    if(userFound && bcrypt.compareSync(password, userFound.passwordHash)){
        res.status(200).json({
            message: "user login successful",
            name: userFound.name,
            email: userFound.email,
            isAdmin: userFound.isAdmin,
            token: generateToken(userFound._id),
            id: userFound._id,
        })
    } else {
        res.status(404).json({
            message: "Invalid username or password provided",
        });
    }
});

//get user profile
router.get("/profile", isLogin, async (req, res) => {
    console.log(getTokenFromHeader(req));
    const userProfile = await User.findById(req.userAuth);
    res.send(userrofile);
});

//update user
router.put("/update", isLogin, isAdmin, async (req, res) => {
    const {
        name,
        email,
        phone,
        street,
        city,
        country,
        zip,
        passwordHash,
        apartment,
    } = req.body;

    const userFound = await  User.findOne({ email });
    if (userFound) {
        res.status(404).send(`${email} User already exist`);
    }
    const user = await User.findByIdAndUpdate(
        req.userAuth,
        {
            name,
            email,
            phone,
            street,
            city,
            country,
            zip,
            passwordHash,
            apartment,
        },
        { new: true }
    );

    res.send(user);
});

//delete User
router.delete("/:id", isAdmin, isLogin, async (req, res)=> {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
        res.status(404).send("The user with ID is not found");
    }
    res.send("user deleted succefully");
})

//get count user
router.get("/get/count", async (req, res) =>{
    const userCount = await User.countDocuments();
    if (!userCount) {
        res.status(404).json({success: false});
    }
    res.send({
        count: userCount,
    });
});

module.exports = router;