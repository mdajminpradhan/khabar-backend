const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'photos/posts' });

const { createPost, getPostById, updatePost, getPost, deletePost, getAllpost } = require('../controllers/post');

const { check } = require('express-validator');

// // post parameter
router.param('postId', getPostById);

// // create post route
router.post(
	'/post/create',
	upload.single('picture'),
	[
		check('title').isLength({ min: 5, max: 100 }).withMessage('Title should be between 5 - 100 characters'),
		check('category').not().isEmpty().withMessage('Category is required'),
		check('date').not().isEmpty().withMessage('Date is required'),
		check('author').not().isEmpty().withMessage('Category is required'),
		check('description')
			.isLength({ min: 5, max: 2000 })
			.withMessage('Description should be between 5 - 2000 characters'),
		// check('tags').isArray().withMessage('Tags should be an array'),
		check('picture').isEmpty().withMessage('Picture is required')
	],
	createPost
);

// // update post
router.put(
	'/post/update/:postId',
	upload.single('picture'),
	[
		check('title').isLength({ min: 5, max: 100 }).withMessage('Title should be between 5 - 100 characters'),
		check('category').not().isEmpty().withMessage('Category is required'),
		check('date').not().isEmpty().withMessage('Date is required'),
		check('author').not().isEmpty().withMessage('Category is required'),
		check('description')
			.isLength({ min: 5, max: 2000 })
			.withMessage('Description should be between 5 - 2000 characters'),
		// check('tags').isArray().withMessage('Tags should be an array'),
		check('picture').isEmpty().withMessage('Picture is required')
	],
	updatePost
);

// getting a post
router.get('/post/:postId', getPost);

// get all post
router.get('/posts', getAllpost);

// delete post
router.delete('/post/delete/:postId', deletePost);

module.exports = router;
