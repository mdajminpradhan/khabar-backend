const Post = require('../models/post');
const Joi = require('joi');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: 'dtowxusgn',
	api_key: '959958128578987',
	api_secret: 'jCtiFZy7QV6MuiT5-K1V4vSxOzk'
});

// post parameter
exports.getPostById = (req, res, next, id) => {
	Post.findById(id).exec((error, post) => {
		if (error) {
			return res.status(400).json({
				error: 'No post found'
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
			'string.base': `"Title" should be a type of 'text'`,
			'string.empty': `"Title" cannot be an empty field`,
			'string.min': `"Title" should have a minimum length of {#limit}`,
			'string.max': `"Title" shouldn't be more than {#limit} characters`,
			'any.required': `"Title" is a required field`
		}),

		category: Joi.string().min(5).max(70).required().messages({
			'string.empty': `"Category" cannot be an empty field`
		}),

		date: Joi.date().required().messages({
			'string.empty': `"Category" cannot be an empty field`
		}),

		author: Joi.string().required().messages({
			'string.empty': `"Title" cannot be an empty field`
		}),

		description: Joi.string().min(15).max(1000).required().messages({
			'string.base': `"Long description" should be a type of 'text'`,
			'string.empty': `"Long description" cannot be an empty field`,
			'string.min': `"Long description" should have a minimum length of {#limit}`,
			'string.max': `"Long description" shouldn't be more than {#limit} characters`,
			'any.required': `"Long description" is a required field`
		}),

		tags: Joi.array().required().messages({
			'string.empty': `"Category" cannot be an empty field`
		})
	});

	const { error } = schema.validate(req.body);

	if (error) {
		return res.status(422).json({
			error: error
		});
	}

	// if there is no picture uploaded from database
	if (!req.file) {
		return res.status(422).json({
			error: 'Picture is required'
		});
	} else if (
		req.file.mimetype !== 'image/png' &&
		req.file.mimetype !== 'image/jpeg' &&
		req.file.mimetype !== 'image/jpg'
	) {
		return res.status(422).json({
			error: 'Picture type should be png or jpeg or jpg'
		});
	}

	// uploading picture in cloudinary
	cloudinary.uploader.upload(req.file.path, (error, result) => {
		if (error) {
			return res.status(422).json({
				error: error
			});
		}

		console.log(result);

		// assigning incoming data to schema
		const post = new Post(req.body);
		post.picture = result.url;
		post.pictureid = result.public_id;

		// saving post to database
		post.save((error, post) => {
			if (error) {
				return res.status(400).json({
					error: 'Could not create post',
					error
				});
			}

			res.json(post);
		});
	});
};

// update post
exports.updatePost = (req, res) => {
	// post validation
	const schema = Joi.object({
		title: Joi.string().min(10).max(100).required().messages({
			'string.base': `"Title" should be a type of 'text'`,
			'string.empty': `"Title" cannot be an empty field`,
			'string.min': `"Title" should have a minimum length of {#limit}`,
			'string.max': `"Title" shouldn't be more than {#limit} characters`,
			'any.required': `"Title" is a required field`
		}),

		category: Joi.string().min(5).max(70).required().messages({
			'string.empty': `"Category" cannot be an empty field`
		}),

		date: Joi.date().required().messages({
			'string.empty': `"Category" cannot be an empty field`
		}),

		author: Joi.string().required().messages({
			'string.empty': `"Title" cannot be an empty field`
		}),

		description: Joi.string().min(15).max(1000).required().messages({
			'string.base': `"Long description" should be a type of 'text'`,
			'string.empty': `"Long description" cannot be an empty field`,
			'string.min': `"Long description" should have a minimum length of {#limit}`,
			'string.max': `"Long description" shouldn't be more than {#limit} characters`,
			'any.required': `"Long description" is a required field`
		}),

		tags: Joi.array().required().messages({
			'string.empty': `"Category" cannot be an empty field`
		})
	});

	const { error } = schema.validate(req.body);

	if (error) {
		return res.status(422).json({
			error: error
		});
	}

	// database info of post
	let post = req.post;

	// destructuring req.body
	const { title, category, date, author, description, tags } = req.body;

	// replacing info
	post.title = title;
	post.category = category;
	post.date = date;
	post.author = author;
	post.description = description;
	post.tags = post.tags;
	post.picture = post.picture;
	post.pictureid = post.pictureid;

	// picture validation
	if (req.file) {
		if (
			req.file.mimetype !== 'image/png' &&
			req.file.mimetype !== 'image/jpeg' &&
			req.file.mimetype !== 'image/jpg'
		) {
			return res.status(422).json({
				error: 'Picture type should be png or jpeg or jpg'
			});
		} else {
			cloudinary.uploader.destroy(post.pictureid);

			// uploading picture in cloudinary
			cloudinary.uploader.upload(req.file.path, (error, result) => {
				if (error) {
					return res.status(422).json({
						error: error
					});
				}

				// assigning incoming data to schema
				post.picture = result.url;
				post.pictureid = result.public_id;

				// saving post to database
				post.save((error, post) => {
					if (error) {
						return res.status(400).json({
							error: 'Could not create post',
							error
						});
					}

					res.json(post);
				});
			});
		}
	} else {
		// saving post to database
		post.save((error, post) => {
			if (error) {
				return res.status(400).json({
					error: 'Could not create post',
					error
				});
			}

			res.json(post);
		});
	}
};

// getting post
exports.getPost = (req, res) => {
	return res.json(req.post);
};

// get all post
exports.getAllPost = (req, res) => {
	Post.find().exec((error, posts) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not find any posts'
			});
		}

		res.json(posts);
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
				error: 'Could not delete post'
			});
		}

		res.json(post);
	});
};
