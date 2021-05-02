const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
	createCategory,
	getCategoryById,
	getAllCategory,
	updateCategory,
	deleteCategory
} = require('../controllers/postcategory');

// category param
router.param('categoryId', getCategoryById);

// category create
router.post(
	'/postcategory/create',
	[
		check('title').not().isEmpty().withMessage('Title is required'),
		check('title').isLength({ min: 3, max: 15 }).withMessage('Category title should be between 3-15 characters')
	],
	createCategory
);

// getting categories
router.get('/postcategories', getAllCategory);

// updating category
router.put(
	'/postcategory/update/:categoryId',
	[
		check('title').not().isEmpty().withMessage('Title is required'),
		check('title').isLength({ min: 3, max: 15 }).withMessage('Category title should be between 3-15 characters')
	],
	updateCategory
);

// deleting category
router.delete('/postcategory/delete/:categoryId', deleteCategory);

module.exports = router;
