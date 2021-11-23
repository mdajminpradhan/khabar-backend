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
			type: [ObjectId],
			ref: 'PostCategory'
		},
		date: {
			type: Date,
			default: Date.now(),
		},
		author: {
			type: ObjectId,
			ref: 'User',
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		tags: {
			type: String,
		},
		pictureid: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', productSchema);
