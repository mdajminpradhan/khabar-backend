const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'photos/categories' });
const { check } = require('express-validator');
const router = express.Router();

const {
	createCategory,
	getCategoryById,
	getAllCategory,
	updateCategory,
	deleteCategory
} = require('../controllers/category');

// category param
router.param('categoryId', getCategoryById);

// category create
router.post(
	'/category/create',
	upload.single('picture'),
	[
		check('title').not().isEmpty().withMessage('Title is required'),
		check('title').isLength({ min: 3, max: 15 }).withMessage('Category title should be between 3-15 characters'),
		// check('picture').notEmpty().withMessage('Picture is required')
	],
	createCategory
);

// getting categories
router.get('/categories', getAllCategory);

// updating category
router.put(
	'/category/update/:categoryId',
	upload.single('picture'),
	[
		check('title').not().isEmpty().withMessage('Title is required'),
		check('title').isLength({ min: 3, max: 15 }).withMessage('Category title should be between 3-15 characters')
	],
	updateCategory
);

// deleting category
router.delete('/category/delete/:categoryId', deleteCategory);

module.exports = router;
