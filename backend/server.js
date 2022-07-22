import express, { application } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';

import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import { isAuth } from './utils.js';

dotenv.config();

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('connected to db');
	})
	.catch((err) => {
		console.log(err.message);
	});

const app = express();
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('/api/create-checkout-session', cors());
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

app.get('/api/keys/paypal', (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.post('/api/create-checkout-session', isAuth, async (req, res) => {
	const cartItems = req.body;
	const session = await stripe.checkout.sessions.create({
		line_items: req.body.cartItems.map((c) => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: c.name,
				},
				unit_amount: Math.round(c.price * 100),
			},
			quantity: c.quantity,
		})),
		mode: 'payment',
		success_url: `${process.env.CLIENT_URL}/paid`,
		cancel_url: `${process.env.CLIENT_URL}/notpaid`,
	});
	res.json({ url: session.url });
	console.log(res);
});

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
	res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
	res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`serve at http://localhost:${port}`);
});
