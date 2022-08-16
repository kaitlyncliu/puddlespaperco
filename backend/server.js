import express, { application } from 'express';
import { auth, requiresAuth } from 'express-openid-connect';
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
import Product from './models/productModel.js';

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

const config = {
	authRequired: false,
	auth0Logout: true,
	baseURL: process.env.CLIENT_URL,
	response_type: 'code', // This requires you to provide a client secret
	clientID: process.env.AUTH0_CLIENT_ID,
	issuerBaseURL: process.env.AUTH0_ISSUER_URL,
	secret: process.env.JWT_SECRET,
	idpLogout: true,
};

app.use(auth(config));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// req.oidc.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
	res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

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

app.post('/api/create-checkout-session', requiresAuth, async (req, res) => {
	const cartItems = req.body.cartItems;
	const listIds = cartItems.map((x) => x._id);
	const idQuantity = new Map();
	cartItems.map((x) => idQuantity.set(x._id, x.quantity));
	const listItems = await Product.find({ _id: listIds });
	const session = await stripe.checkout.sessions.create({
		line_items: listItems.map((x) => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: x.name,
				},
				unit_amount: Math.round(x.price * 100),
			},
			quantity: idQuantity.get(x._id.valueOf()),
		})),
		mode: 'payment',
		success_url: `${process.env.CLIENT_URL}/checkout-success`,
		cancel_url: `${process.env.CLIENT_URL}/cart`,
	});

	res.json({ url: session.url });
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
