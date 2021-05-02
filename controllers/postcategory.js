const { validationResult } = require('express-validator');
const Category = require('../models/postcategory');

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
	// getting errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg
		});
	}

	// saving category in database
	const category = new Category(req.body);

	category.save((error, category) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not create category'
			});
		}

		// sending response
		res.json(category);
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

// update category
exports.updateCategory = (req, res) => {
	// getting errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg
		});
	}

	// getting category from parameter
	const category = req.category;

	// setting category comming from front-end
	category.title = req.body.title;

	console.log(req.body);

	// updating category
	category.save((error, updatedCategory) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not update your category',
				error
			});
		}

		// sending response
		res.json(updatedCategory);
	});
};

// delete category
exports.deleteCategory = (req, res) => {
	// getting category from parameter
	const category = req.category;

	// if no category found on the id
	if (!category) {
		return res.status(400).json({
			error: 'No category found'
		});
	}

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
