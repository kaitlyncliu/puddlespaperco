import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, verifyJwt } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
	'/signup',
	expressAsyncHandler(async (req, res) => {
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password),
		});
		const user = await newUser.save();
		res.send({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user),
		});
	})
);

userRouter.put(
	'/profile',
	verifyJwt,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.user._id);
		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			if (req.body.password) {
				user.password = bcrypt.hashSync(req.body.password, 8);
			}
			const updatedUser = await user.save();
			res.send({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
				token: generateToken(updatedUser),
			});
		} else {
			res.status(404).send({ message: 'User not found' });
		}
	})
);

export default userRouter;
