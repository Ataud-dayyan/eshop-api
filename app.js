require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

//Router connection
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");
const categoryRouter = require("./routes/categoryRouter");
const userRouter = require("./routes/userRouter");
const globalErHandler = require("./middleware/globalErrHandler")
app.use(cors());
app.options("*", cors());

//middle ware
app.use(express.json())
app.use(morgan("tiny"));

//env connection
const api = process.env.API_URL;
const dbLink = process.env.CONNECTION_STRING;

//database connection
mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ecomerce"
}).then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.log(err);
});

//routes
// // product router
app.use(`${api}/products`, productRouter);
// // // category router
app.use(`${api}/categories`, categoryRouter);
// // user router
app.use(`${api}/user`, userRouter);
// // order router
app.use(`${api}/order`, orderRouter);

//error handler
app.use(globalErHandler)

// app Error
app.use("*", (req, res) =>{
    res.status(404).json({
        message: `${req.originalUrl} - Router not found`,
    });
});

//listen to server
app.listen(2009, () => {
    console.log(`Server running on http://localhost:2009/api/v1`);
})