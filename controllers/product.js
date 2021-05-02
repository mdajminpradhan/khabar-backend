const Product = require('../models/product');
const fs = require('fs');
const { validationResult } = require('express-validator');

// product parameter
exports.getProductById = (req, res, next, id) => {
	Product.findById(id).exec((error, product) => {
		if (error) {
			return res.status(400).json({
				error: 'No product found'
			});
		}

		req.product = product;
		console.log(req.product);
		next();
	});
};

// create product
exports.createProduct = (req, res) => {
	// getting errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg
		});
	}

	// assigning incoming data to schema
	const product = new Product(req.body);

	// setting filename separatly
	product.picture = req.file.filename;

	// saving product to database
	product.save((error, product) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not create product', error
			});
		}

		res.json(product);
	});
};

// update product
exports.updateProduct = (req, res) => {
	// getting errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg
		});
	}

	// database info of product
	let product = req.product;

	// destructuring req.body
	const { title, shortdescription, price, reqgularprice, category, picture } = req.body;

	// replacing info
	product.title = title;
	product.shortdescription = shortdescription;
	product.price = price;
	product.reqgularprice = reqgularprice;
	product.category = category;
	product.picture = req.file.filename;

	// saving product to database
	product.save((error, product) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not update product'
			});
		}

		res.json(product);
	});
};

// getting product
exports.getProduct = (req, res) => {
	return res.json(req.product);
};

// get all product
exports.getAllProduct = (req, res) => {
	Product.find().exec((error, products) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not find any product'
			});
		}

		res.json(products);
	});
};

// delete product
exports.deleteProduct = (req, res) => {
	const product = req.product;

	const productImage = product.picture;

	fs.unlinkSync(`photos/products/${productImage}`);

	product.remove((error, product) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not delete product'
			});
		}

		res.json(product);
	});
};
