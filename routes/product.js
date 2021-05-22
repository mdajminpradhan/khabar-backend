const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
	storage: multer.diskStorage({})
});

const { isSignedIn, isAuthenticated, isAdmin, getProfileById } = require('../controllers/user');

const {
	createProduct,
	getProductById,
	updateProduct,
	getProduct,
	deleteProduct,
	getAllProduct
} = require('../controllers/product');

// profile param
router.param('profileId', getProfileById);

// product parameter
router.param('productId', getProductById);

// create product route
router.post(
	'/product/create/:profileId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	upload.single('picture'),
	createProduct
);

// update product
router.put(
	'/product/update/:productId/:profileId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	upload.single('picture'),
	updateProduct
);

// getting a product
router.get('/product/:productId', getProduct);

// get all product
router.get('/products', getAllProduct);

// delte product
router.delete('/product/delete/:productId/:profileId', isSignedIn, isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
