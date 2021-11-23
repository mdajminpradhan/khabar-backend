const Product = require("../models/product");
const Joi = require("joi");
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dtowxusgn",
  api_key: "959958128578987",
  api_secret: "jCtiFZy7QV6MuiT5-K1V4vSxOzk",
});

// product parameter
exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((error, product) => {
    if (error) {
      return res.status(400).json({
        error: "No product found",
      });
    }

    req.product = product;
    next();
  });
};

// create product
exports.createProduct = (req, res) => {
  // validation of details
  const schema = Joi.object({
    title: Joi.string().min(5).max(70).required().messages({
      "string.base": `"Title" should be a type of 'text'`,
      "string.empty": `"Title" cannot be an empty field`,
      "string.min": `"Title" should have a minimum length of {#limit}`,
      "string.max": `"Title" shouldn't be more than {#limit} characters`,
      "any.required": `"Title" is a required field`,
    }),

    shortdescription: Joi.string().min(15).max(200).required().messages({
      "string.base": `"Short description" should be a type of 'text'`,
      "string.empty": `"Short description" cannot be an empty field`,
      "string.min": `"Short description" should have a minimum length of {#limit}`,
      "string.max": `"Short description" shouldn't be more than {#limit} characters`,
      "any.required": `"Short description" is a required field`,
    }),

    longdescription: Joi.string().min(15).max(2000).required().messages({
      "string.base": `"Long description" should be a type of 'text'`,
      "string.empty": `"Long description" cannot be an empty field`,
      "string.min": `"Long description" should have a minimum length of {#limit}`,
      "string.max": `"Long description" shouldn't be more than {#limit} characters`,
      "any.required": `"Long description" is a required field`,
    }),

    isFeatured: Joi.boolean(),

    category: Joi.array().min(1).max(10).required(),

    price: Joi.number().min(1).max(100000).messages({
      "string.base": `"Regular price" should be a type of 'number'`,
      "string.empty": `"Regular price" cannot be an empty field`,
      "string.min": `"Regular price" should have a minimum length of {#limit}`,
      "string.max": `"Regular price" shouldn't be more than {#limit} characters`,
      "any.required": `"Regular price" is a required field`,
    }),

    specialprice: Joi.number(),

    // tags: Joi.array().min(1).max(20).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(422).json({
      error: error.details[0].message,
    });
  }

  // if there is no picture uploaded from database
  if (!req.file) {
    return res.status(422).json({
      error: "Picture is required",
    });
  } else if (
    req.file.mimetype !== "image/png" &&
    req.file.mimetype !== "image/jpeg" &&
    req.file.mimetype !== "image/jpg"
  ) {
    return res.status(422).json({
      error: "Picture type should be png or jpeg or jpg",
    });
  } else {
    // uploading picture in cloudinary
    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        return res.status(422).json({
          error: error,
        });
      }

      // console.log(result);

      //  assigning incoming data to schema
      const product = new Product(req.body);
      product.picture = result.url;
      product.pictureid = result.public_id;

      // 	// saving product to database
      product.save((error, product) => {
        if (error) {
          return res.status(400).json({
            error: "Could not create product",
            error,
          });
        }

        console.log(product);

        res.json({ success: "You have create a product successfully..." });
      });
    });
  }
};

// update product
exports.updateProduct = (req, res) => {
  // validation of details
  const schema = Joi.object({
    _id: Joi.string(),

    title: Joi.string().min(5).max(70).required().messages({
      "string.base": `"Title" should be a type of 'text'`,
      "string.empty": `"Title" cannot be an empty field`,
      "string.min": `"Title" should have a minimum length of {#limit}`,
      "string.max": `"Title" shouldn't be more than {#limit} characters`,
      "any.required": `"Title" is a required field`,
    }),

    shortdescription: Joi.string().min(15).max(200).required().messages({
      "string.base": `"Short description" should be a type of 'text'`,
      "string.empty": `"Short description" cannot be an empty field`,
      "string.min": `"Short description" should have a minimum length of {#limit}`,
      "string.max": `"Short description" shouldn't be more than {#limit} characters`,
      "any.required": `"Short description" is a required field`,
    }),

    longdescription: Joi.string().min(15).max(2000).required().messages({
      "string.base": `"Long description" should be a type of 'text'`,
      "string.empty": `"Long description" cannot be an empty field`,
      "string.min": `"Long description" should have a minimum length of {#limit}`,
      "string.max": `"Long description" shouldn't be more than {#limit} characters`,
      "any.required": `"Long description" is a required field`,
    }),

    picture: Joi.string(),
    pictureid: Joi.string(),

    isFeatured: Joi.boolean(),

    category: Joi.array().min(1).max(10).required(),

    price: Joi.number().min(1).max(100000).messages({
      "string.base": `"Regular price" should be a type of 'number'`,
      "string.empty": `"Regular price" cannot be an empty field`,
      "string.min": `"Regular price" should have a minimum length of {#limit}`,
      "string.max": `"Regular price" shouldn't be more than {#limit} characters`,
      "any.required": `"Regular price" is a required field`,
    }),

    specialprice: Joi.number(),

    // tags: Joi.array().min(1).max(20).required(),
  });

  console.log(req.body);

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(422).json({
      error: error.details[0].message,
    });
  } else {
    if (!req.file) {
      Product.findByIdAndUpdate(
        { _id: req.product._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, product) => {
          if (err) {
            return res.status(400).json({
              error: "You are not able to update this product",
            });
          }
          res.json(product);
        }
      );
    } else if (req.file) {
      if (
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "image/jpeg" &&
        req.file.mimetype !== "image/jpg"
      ) {
        return res.status(422).json({
          error: "Picture type should be png or jpeg or jpg",
        });
      } else {
        // uploading picture in cloudinary
        cloudinary.uploader.upload(req.file.path, (error, result) => {
          if (error) {
            return res.status(422).json({
              error: error,
            });
          } else if (result) {
            cloudinary.uploader.destroy(req.product.pictureid);
            req.body.pictureid = result.public_id;
            Product.findByIdAndUpdate(
              { _id: req.product._id },
              { $set: req.body },
              { new: true, useFindAndModify: false },
              (err, product) => {
                if (err) {
                  return res.status(400).json({
                    error: "You are not authorized to update this user",
                  });
                }
                res.json(product);
              }
            );
          }
        });
      }
    }
  }
};

// getting product
exports.getProduct = (req, res) => {
  req.product.picture = undefined;
  req.product.createdAt = undefined;
  req.product.updatedAt = undefined;
  req.product.__v = undefined;

  return res.json(req.product);
};

// get all product
exports.getAllProduct = (req, res) => {
  Product.find().exec((error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Could not find any product",
      });
    }

    res.json(products);
  });
};

// get post picture
exports.getProductPicture = (req, res) => {
  Product.findById(req.body.id).exec((error, product) => {
    if (error) {
      return res.status(422).json({
        error: error,
      });
    }

    res.json({ picture: product.picture });
  });
};

// delete product
exports.deleteProduct = (req, res) => {
  const product = req.product;

  console.log(product);

  // removing picture from cloudinary
  cloudinary.uploader.destroy(product.pictureid);

  product.remove((error, product) => {
    if (error) {
      return res.status(400).json({
        error: "Could not delete product",
      });
    }

    res.json(product);
  });
};
