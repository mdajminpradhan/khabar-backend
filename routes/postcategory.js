const express = require('express');
const multer = require('multer');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin, getProfileById } = require('../controllers/user');

const {
	createCategory,
	getCategoryById,
	getAllCategory,
	updateCategory,
	deleteCategory
} = require('../controllers/postcategory');

// profile param
router.param('profileId', getProfileById);

// category param
router.param('categoryId', getCategoryById);

// category create
router.post('/postcategory/create/:profileId', isSignedIn, isAuthenticated, isAdmin, createCategory);

// getting categories
router.get('/postcategories', getAllCategory);

// updating category
router.put('/postcategory/update/:categoryId/:profileId', isSignedIn, isAuthenticated, isAdmin, updateCategory);

// deleting category
router.delete('/postcategory/delete/:categoryId/:profileId', isSignedIn, isAuthenticated, isAdmin, deleteCategory);

module.exports = router;
