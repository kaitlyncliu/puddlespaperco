import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { verifyJwt } from '../utils.js';

dotenv.config();
const stripeRouter = express.Router();
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

stripeRouter.post(
	'/create-checkout-session',
	verifyJwt,
	express.json(),
	async (req, res) => {
		const cartItems = req.body.cartItems;

		const customer = await stripe.customers.create({
			metadata: {
				userId: JSON.stringify(req.body.userId),
				cart: JSON.stringify(req.body.cartItems),
			},
		});

		console.log(req.body);
		const listIds = cartItems.map((x) => x._id);
		const idQuantity = new Map();
		cartItems.map((x) => idQuantity.set(x._id, x.quantity));
		const listItems = await Product.find({ _id: listIds });
		const line_items_data = listItems.map((x) => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: x.name,
				},
				unit_amount: Math.round(x.price * 100),
			},
			quantity: idQuantity.get(x._id.valueOf()),
		}));
		const session = await stripe.checkout.sessions.create({
			customer: customer.id,
			shipping_address_collection: {
				allowed_countries: ['US'],
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: 'fixed_amount',
						fixed_amount: {
							amount: 0,
							currency: 'usd',
						},
						display_name: 'Free shipping',
						// Delivers between 5-7 business days
						delivery_estimate: {
							minimum: {
								unit: 'business_day',
								value: 5,
							},
							maximum: {
								unit: 'business_day',
								value: 7,
							},
						},
					},
				},
				{
					shipping_rate_data: {
						type: 'fixed_amount',
						fixed_amount: {
							amount: 1500,
							currency: 'usd',
						},
						display_name: 'Next day air',
						// Delivers in exactly 1 business day
						delivery_estimate: {
							minimum: {
								unit: 'business_day',
								value: 1,
							},
							maximum: {
								unit: 'business_day',
								value: 1,
							},
						},
					},
				},
			],
			line_items: line_items_data,
			mode: 'payment',
			success_url: `${process.env.CLIENT_URL}/checkout-success`,
			cancel_url: `${process.env.CLIENT_URL}/cart`,
		});

		res.json({ url: session.url });
	}
);

const createOrder = async (customer, data) => {
	const Items = JSON.parse(customer.metadata.cart);
	const newOrder = new Order({
		userId: customer.metadata.userId,
		customerId: data.customer,
		paymentIntentId: data.payment_intent,
		products: Items,
		subtotal: data.amount_subtotal,
		total: data.amount_total,
		shipping: data.customer_details,
		paymentStatus: data.payment_status,
	});

	try {
		const savedOrder = await newOrder.save();
		console.log('Processed order: ', savedOrder);
	} catch (err) {
		console.log(err);
	}
};

// Stripe webhook
stripeRouter.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	(req, res) => {
		const sig = req.headers['stripe-signature'];
		let event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				sig,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.log('error verifying signature');
			return res.status(400).send(`Webhook Error: ${err.message}`);
		}

		const data = event.data.object;
		// Handle the event
		switch (event.type) {
			case 'checkout.session.completed':
				console.log('checkout done');
				stripe.customers
					.retrieve(data.customer)
					.then((customer) => {
						createOrder(customer, data);
					})
					.catch((err) => console.log(err.message));
				break;
			// ... handle other event types
			default:
				console.log(`Unhandled event type ${event.type}`);
		}

		res.json({ received: true });
	}
);

export default stripeRouter;
