const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		shortdescription: {
			type: String,
			required: true,
			trim: true
		},
		price: {
			type: Number,
			required: true,
			trim: true
		},
		specialprice: {
			type: Number,
			trim: true
		},
		category: {
			type: [ObjectId],
			ref: 'Category'
		},
		longdescription: {
			type: String,
			required: true,
			trim: true
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		picture: {
			type: String,
			required: true,
			trim: true
		},
		pictureid: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
