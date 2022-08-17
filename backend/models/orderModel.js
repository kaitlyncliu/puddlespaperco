import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		orderItems: [
			{
				// required: true missing for top 5
				slug: { type: String },
				name: { type: String },
				quantity: { type: Number },
				image: { type: String },
				price: { type: Number },
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
			},
		],
		shippingAddress: {
			fullName: { type: String, required: true },
			address: { type: String, required: true },
			city: { type: String, required: true },
			zipCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		itemsPrice: { type: Number, required: true },
		shippingPrice: { type: Number, required: true },
		taxPrice: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
		user: { type: String, ref: 'User', required: true },
		isDelivered: { type: Boolean, default: false },
		deliveredAt: { type: Date },
	},

	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
