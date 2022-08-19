import express from 'express';
import Order from '../models/orderModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth, verifyJwt } from '../utils.js';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';

const orderRouter = express.Router();

orderRouter.get(
	'/mine',
	verifyJwt,
	expressAsyncHandler(async (req, res) => {
		const orders = await Order.find({
			userId: req.query.userId,
		});
		res.send(orders);
	})
);

orderRouter.get(
	'/:id',
	verifyJwt,
	expressAsyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id);
		if (order) {
			const products = await Promise.all(
				order.products.map(async (x) => {
					const object = await Product.findById(x._id);
					const product_data = {
						object: object,
						quantity: x.quantity,
						price: x.price,
					};
					return product_data;
				})
			);
			res.send({ order: order, products: products });
		} else {
			res.status(404).send({ message: 'Order Not Found' });
		}
	})
);

export default orderRouter;
