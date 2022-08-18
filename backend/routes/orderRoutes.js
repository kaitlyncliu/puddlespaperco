import express from 'express';
import Order from '../models/orderModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth, verifyJwt } from '../utils.js';
import Stripe from 'stripe';
import mongoose from 'mongoose';

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
			res.send(order);
		} else {
			res.status(404).send({ message: 'Order Not Found' });
		}
	})
);

export default orderRouter;
