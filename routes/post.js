const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
	storage: multer.diskStorage({})
});

const { isSignedIn, isAuthenticated, isAdmin, getProfileById } = require('../controllers/user');

const { createPost, getPostById, updatePost, getPost, deletePost, getAllpost } = require('../controllers/post');

// profile param
router.param('profileId', getProfileById);

// // post parameter
router.param('postId', getPostById);

// // create post route
router.post('/post/create', isSignedIn, isAuthenticated, isAdmin, upload.single('picture'), createPost);

// // update post
router.put('/post/update/:postId', isSignedIn, isAuthenticated, isAdmin, upload.single('picture'), updatePost);

// getting a post
router.get('/post/:postId', getPost);

// get all post
router.get('/posts', getAllpost);

// delete post
router.delete('/post/delete/:postId', isSignedIn, isAuthenticated, isAdmin, deletePost);

module.exports = router;
