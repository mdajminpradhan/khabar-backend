const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		category: {
			type: ObjectId,
			ref: 'BlogCategory'
		},
		date: {
			type: Date,
			default: Date.now(),
			required: true,
			trim: true
		},
		author: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		tags: {
			type: [],
			required: true
		},
		picture: {
			type: String,
			required: true,
			trim: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', productSchema);
