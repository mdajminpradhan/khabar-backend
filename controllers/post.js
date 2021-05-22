const Post = require('../models/post');
const fs = require('fs')

// product parameter
exports.getPostById = (req, res, next, id) => {
	Post.findById(id).exec((error, post) => {
		if (error) {
			return res.status(400).json({
				error: 'No product found'
			});
		}

		req.post = post;
		next();
	});
};

// create post
exports.createPost = (req, res) => {


	// assigning incoming data to schema
	const post = new Post(req.body);

	// setting filename separatly
	post.picture = req.file.filename;

	// saving post to database
	post.save((error, post) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not create post', error
			});
		}

		res.json(post);
	});
};

// update post
exports.updatePost = (req, res) => {


	// database info of post
	let post = req.post;
	

	// destructuring req.body
	const { title, category, date, author, description, tags, picture } = req.body;

	// replacing info
	post.title = title;
	post.category = category;
	post.date = date;
	post.author = author;
	post.description = description;
	post.tags = tags;
	post.picture = req.file.filename;

	// saving post to database
	post.save((error, post) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not update post'
			});
		}

		res.json(post);
	});
};

// getting post
exports.getPost = (req, res) => {
	return res.json(req.post);
};

// get all post
exports.getAllpost = (req, res) => {
	Post.find().exec((error, posts) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not find any posts'
			});
		}

		res.json(posts);
	})
}

// delete post
exports.deletePost = (req, res) => {
	const post = req.post;

	const postImage = post.picture;

	fs.unlinkSync(`photos/posts/${postImage}`)

	post.remove((error, post) => {
		if (error) {
			return res.status(400).json({
				error: 'Could not delete post'
			});
		}

		res.json(post);
	});
};
