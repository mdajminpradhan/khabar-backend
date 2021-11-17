require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// connecting mongodb
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection failed", error);
  });

// bringing all routes
const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const postcategory = require("./routes/postcategory");
const post = require("./routes/post");

// making api
app.use("/api", user);
app.use("/api", product);
app.use("/api", category);
app.use("/api", postcategory);
app.use("/api", post);
 
// assigning port
const port = process.env.PORT || 5000;

// creating server
app.listen(port, () => {
  console.log("Server started successfully...");
});
