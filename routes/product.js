const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'photos/products' });

const { check } = require('express-validator');

const { createProduct, getProductById, updateProduct, getProduct, deleteProduct, getAllProduct } = require('../controllers/product');

// product parameter
router.param('productId', getProductById);

// create product route
router.post(
	'/product/create',
	upload.single('picture'),
	[
		check('title').isLength({ min: 5, max: 50 }).withMessage('Title should be between 5 - 50 characters'),
		check('shortdescription')
			.isLength({ min: 5, max: 200 })
			.withMessage('Title should be between 5 - 200 characters'),
		check('price').isNumeric().withMessage('Price should be in number'),
		check('price').isLength({ min: 1, max: 6 }).withMessage('Price should be between 1 - 6 characters'),
		check('longdescription').isLength({ min: 15, max: 1000 }).withMessage('Price should be between 1 - 6 characters'),
		check('category').not().isEmpty().withMessage('Category is required'),
		check('picture').isEmpty().withMessage('Picture is required')
	],
	createProduct
);

// update product
router.put(
	'/product/update/:productId',
	upload.single('picture'),
	[
		check('title').isLength({ min: 5, max: 50 }).withMessage('Title should be between 5 - 50 characters'),
		check('shortdescription')
			.isLength({ min: 5, max: 200 })
			.withMessage('Title should be between 5 - 200 characters'),
		check('price').isNumeric().withMessage('Price should be in number'),
		check('price').isLength({ min: 1, max: 6 }).withMessage('Price should be between 1 - 6 characters'),
		check('category').not().isEmpty().withMessage('Category is required'),
		check('picture').isEmpty().withMessage('Picture is required')
	],
	updateProduct
);

// getting a product
router.get('/product/:productId', getProduct);

// get all product
router.get('/products', getAllProduct)

// delte product
router.delete('/product/delete/:productId', deleteProduct);

module.exports = router;
