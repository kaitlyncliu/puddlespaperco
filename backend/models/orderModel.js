import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		customerId: { type: String },
		paymentIntentId: { type: String },
		products: [
			{
				// required: true missing for top 5
				_id: { type: String, required: true },
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
			},
		],
		shipping: {
			type: Object,
			required: true,
		},
		subtotal: { type: Number, required: true },
		tax: { type: Number },
		total: { type: Number, required: true },
		isDelivered: { type: Boolean, default: false },
		deliveryStatus: { type: String, default: 'Not delivered' },
		paymentStatus: { type: String, required: true },
	},

	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
