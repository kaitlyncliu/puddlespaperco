import mongoose from 'mongoose';
import Stripe from 'stripe';

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true },
		images: [{ type: String, required: true }],
		category: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		countInStock: { type: Number, required: true },
		rating: { type: Number, required: false },
		numReviews: { type: Number, required: false },
	},

	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);
export default Product;
