const Category = require('../models/postcategory');
const Joi = require('joi');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: 'dtowxusgn',
	api_key: '959958128578987',
	api_secret: 'jCtiFZy7QV6MuiT5-K1V4vSxOzk'
});

// category param
exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((error, category) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not get any category'
			});
		}

		req.category = category;
		next();
	});
};

// create category
exports.createCategory = (req, res) => {
	console.log(req.file);

	// data validation
	const schema = Joi.object({
		title: Joi.string().min(3).max(15).required().messages({
			'string.base': `"Category" should be a type of 'text'`,
			'string.empty': `"Category" cannot be an empty field`,
			'string.min': `"Category" should have a minimum length of {#limit}`,
			'any.required': `"Category" is a required field`
		})
	});

	const { error, success } = schema.validate(req.body);

	if (error) {
		return res.status(422).json({
			error: error.details[0].message
		});
	}

	// if there is no picture uploaded from database
	if (!req.file) {
		return res.status(422).json({
			error: 'Pictures is required'
		});
	} else if (req.file.mimetype !== 'image/x-icon') {
		return res.status(422).json({
			error: 'Picture type should be png or jpeg or jpg'
		});
	}

	// saving category in database
	cloudinary.uploader.upload(req.file.path, (error, result) => {
		if (error) {
			console.log(error);
			return res.status(422).json({
				error: error
			});
		}

		const category = new Category(req.body);

		category.icon = result.url;
		category.iconid = result.public_id;

		category.save((error, category) => {
			if (error) {
				return res.status(400).json({
					error: 'Could not create category',
					error
				});
			}

			// sending response
			res.json(category);
		});
	});
};

// getting categories
exports.getAllCategory = (req, res) => {
	// getting category from database
	Category.find().exec((error, categories) => {
		if (error) {
			return res.status(400).json({
				error: 'There are no categores'
			});
		}

		// sending response
		res.json(categories);
	});
};

// get category by id
exports.getCat = (req, res) => {
	return res.json(req.category);
};

// update category
exports.updateCategory = (req, res) => {

	console.log(req.body)
	console.log(req.file)

	// data validation

	const schema = Joi.object({
		title: Joi.string().min(3).max(15).required().messages({
			'string.base': `"Category" should be a type of 'text'`,
			'string.empty': `"Category" cannot be an empty field`,
			'string.min': `"Category" should have a minimum length of {#limit}`,
			'any.required': `"Category" is a required field`
		})
	});

	const { error, success } = schema.validate(req.body);

	if (error) {
		return res.status(422).json({
			error: error.details[0].message
		});
	}

	let category = req.category;

	// if there is no picture uploaded from database
	if (!req.file) {
		category.save((error, category) => {
			category.title = req.body.title;
			category.icon = category.icon;
			category.iconid = category.iconid;

			category.save((error, category) => {
				if (error) {
					return res.status(400).json({
						error: 'Could not create category',
						error
					});
				}

				// sending response
				res.json(category);
			});
		});
	} else if (
		req.files.image[0].mimetype !== 'image/png' &&
		req.files.image[0].mimetype !== 'image/jpeg' &&
		req.files.image[0].mimetype !== 'image/jpg' &&
		req.files.icon[1].mimetype !== 'image/vnd.microsoft.icon'
	) {
		return res.status(422).json({
			error: 'Picture type should be png or jpeg or jpg'
		});
	}

	// saving category in database
	cloudinary.uploader.upload(req.files.image[0].path, (error, result) => {
		if (error) {
			console.log(error);
			return res.status(422).json({
				error: error
			});
		}
		category.title = req.body.title;
		category.icon = result.url;
		category.iconid = result.public_id;

		category.save((error, category) => {
			if (error) {
				return res.status(400).json({
					error: 'Could not create category',
					error
				});
			}

			// sending response
			res.json(category);
		});
	});
};

// delete category
exports.deleteCategory = (req, res) => {
	// getting category from parameter
	const category = req.category;

	// deleting category from database
	category.remove((error, deletedCategory) => {
		if (error) {
			return res.status(400).json({
				error: 'Category could not be removed'
			});
		}

		// sending response
		res.json(deletedCategory);
	});
};
