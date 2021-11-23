const Post = require("../models/post");
const Joi = require("joi");
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dtowxusgn",
  api_key: "959958128578987",
  api_secret: "jCtiFZy7QV6MuiT5-K1V4vSxOzk",
});

// post parameter
exports.getPostById = (req, res, next, id) => {
  Post.findById(id)
    .populate("author", "name")
    .populate("category", "title")
    .exec((error, post) => {
      if (error) {
        return res.status(400).json({
          error: "No post found",
        });
      }

      req.post = post;
      next();
    });
};

// post parameter without cate details
exports.getPostIdWithoutCateDetails = (req, res, next, id) => {
  Post.findById(id).exec((error, post) => {
    if (error) {
      return res.status(400).json({
        error: "No post found",
      });
    }

    req.post = post;
    next();
  });
};

// create post
exports.createPost = (req, res) => {
  // post validation
  const schema = Joi.object({
    title: Joi.string().min(10).max(100).required().messages({
      "string.base": `"Title" should be a type of 'text'`,
      "string.empty": `"Title" cannot be an empty field`,
      "string.min": `"Title" should have a minimum length of {#limit}`,
      "string.max": `"Title" shouldn't be more than {#limit} characters`,
      "any.required": `"Title" is a required field`,
    }),

    category: Joi.array().min(1).max(15).required().messages({
      "string.base": `"Category" should be a type of 'array'`,
      "string.empty": `"Category" cannot be an empty field`,
      "string.min": `"Category" should have a minimum length of {#limit}`,
      "string.max": `"Category" shouldn't be more than {#limit} characters`,
      "any.required": `"Category" is a required field`,
    }),

    author: Joi.string().required().messages({
      "string.empty": `"Title" cannot be an empty field`,
    }),

    description: Joi.string().min(15).max(5000).required().messages({
      "string.base": `"Post description" should be a type of 'text'`,
      "string.empty": `"Post description" cannot be an empty field`,
      "string.min": `"Post description" should have a minimum length of {#limit}`,
      "string.max": `"Post description" shouldn't be more than {#limit} characters`,
      "any.required": `"Post description" is a required field`,
    }),

    tags: Joi.string(),
  });

  console.log(req.body);

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
        console.log(error);
        return res.status(422).json({
          error: error,
        });
      } else if (result) {
        console.log(result);

        // assigning incoming data to schema
        const post = new Post(req.body);
        post.pictureid = result.public_id;

        // saving post to database
        post.save((error, post) => {
          if (error) {
            return res.status(400).json({
              error: "Could not create post",
              error,
            });
          }

          res.json({
            successs: "Post have been created successfully...",
          });
        });
      }
    });
  }
};

// update post
exports.updatePost = (req, res) => {

  console.log(req.body)

  // post validation
  const schema = Joi.object({
    _id: Joi.string(),

    title: Joi.string().min(10).max(100).required().messages({
      "string.base": `"Title" should be a type of 'text'`,
      "string.empty": `"Title" cannot be an empty field`,
      "string.min": `"Title" should have a minimum length of {#limit}`,
      "string.max": `"Title" shouldn't be more than {#limit} characters`,
      "any.required": `"Title" is a required field`,
    }),

    category: Joi.array().min(1).max(15).required().messages({
      "string.base": `"Category" should be a type of 'array'`,
      "string.empty": `"Category" cannot be an empty field`,
      "string.min": `"Category" should have a minimum length of {#limit}`,
      "string.max": `"Category" shouldn't be more than {#limit} characters`,
      "any.required": `"Category" is a required field`,
    }),

    author: Joi.string().required(),

    pictureid: Joi.string(),

    description: Joi.string().min(15).max(5000).required().messages({
      "string.base": `"Post description" should be a type of 'text'`,
      "string.empty": `"Post description" cannot be an empty field`,
      "string.min": `"Post description" should have a minimum length of {#limit}`,
      "string.max": `"Post description" shouldn't be more than {#limit} characters`,
      "any.required": `"Post description" is a required field`,
    }),

    tags: Joi.array().min(1).max(15).required().messages({
      "string.empty": `"Category" cannot be an empty field`,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(422).json({
      error: error,
    });
  } else {
    if (!req.file) {
      Post.findByIdAndUpdate(
        { _id: req.post._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, post) => {
          if (err) {
            return res.status(400).json({
              error: "You are not able to update this post",
            });
          }
          res.json(post);
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
            cloudinary.uploader.destroy(req.post.pictureid);
            req.body.pictureid = result.public_id;
            Post.findByIdAndUpdate(
              { _id: req.post._id },
              { $set: req.body },
              { new: true, useFindAndModify: false },
              (err, post) => {
                if (err) {
                  return res.status(400).json({
                    error: "You are not authorized to update this user",
                  });
                }
                res.json(post);
              }
            );
          }
        });
      }
    }
  }
};

// getting post
exports.getPost = (req, res) => {
  req.post.picture = undefined;
  return res.json(req.post);
};

// getting post
exports.getPostWithCateDetails = (req, res) => {
  req.post.picture = undefined;
  return res.json(req.post);
};

// get all post
exports.getAllPost = (req, res) => {
  let limit = req.body.liimt ? req.body.limit : 12;
  // let sortBy = req.query.sortBy ? req.query.sortBy : '_id';

  Post.find()
    .select("-picture")
    .limit(limit)
    .populate("author", "name")
    .populate("category", "title")
    .exec((error, posts) => {
      if (error) {
        return res.status(400).json({
          error: "Could not find any posts",
        });
      }

      res.json(posts);
    });
};

// get post picture
exports.getPostPicture = (req, res) => {
  Post.findById(req.body.id).exec((error, post) => {
    if (error) {
      return res.status(422).json({
        error: error,
      });
    }

    res.json({ picture: post.picture });
  });
};

// delete post
exports.deletePost = (req, res) => {
  const post = req.post;

  // removing picture from cloudinary
  cloudinary.uploader.destroy(post.pictureid);

  post.remove((error, post) => {
    if (error) {
      return res.status(400).json({
        error: "Could not delete post",
      });
    }

    res.json(post);
  });
};
