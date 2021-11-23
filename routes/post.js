const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
	storage: multer.diskStorage({})
});

const { isSignedIn, isAuthenticated, isAdmin, getProfileById } = require('../controllers/user');

const {
	createPost,
	getPostById,
	getPostIdWithoutCateDetails,
	updatePost,
	getPost,
	deletePost,
	getAllPost,
	getPostPicture
} = require('../controllers/post');

// profile param
router.param('profileId', getProfileById);

// post parameter
router.param('postId', getPostById);

// post parameter
router.param('postIdWithoutCateDetails', getPostIdWithoutCateDetails);

// // create post route
router.post('/post/create/:profileId', isSignedIn, isAuthenticated, isAdmin, upload.single('picture'), createPost);

// // update post
router.put(
	'/post/update/:postIdWithoutCateDetails/:profileId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	upload.single('picture'),
	updatePost
);

// getting a post
router.get('/post/:postId', getPost);

// getting a post
router.get('/post/withoutcatedetails/:postIdWithoutCateDetails', getPost);

// get all post
router.get('/posts', getAllPost);

// get post picture
router.post('/postpicture', getPostPicture);

// delete post
router.delete('/post/delete/:postId/:profileId', isSignedIn, isAuthenticated, isAdmin, deletePost);

module.exports = router;
