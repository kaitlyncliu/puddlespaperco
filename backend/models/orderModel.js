import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		customerId: { type: String },
		paymentIndentId: { type: String },
		products: [
			{
				// required: true missing for top 5
				id: { type: String },
				name: { type: String },
				desc: { type: String },
				cartQuantity: { type: Number },
				image: { type: String },
				price: { type: Number },
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
		deliveryStatus: { type: Date },
		paymentStatus: { type: String, required: true },
	},

	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
