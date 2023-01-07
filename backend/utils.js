import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import jwks from 'jwks-rsa';

export const generateToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '10d',
		}
	);
};

export const isAuth = (req, res, next) => {
	const authorization = req.headers.authorization;
	if (authorization) {
		const token = authorization.slice(7, authorization.length);
		jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
			if (err) {
				res.status(401).send({ message: 'Invalid Token' });
			} else {
				req.user = decode;
				next();
			}
		});
	} else {
		res.status(401).send({ message: 'No Token' });
	}
};

export const verifyJwt = expressjwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://dev-qmtahjgk.us.auth0.com/.well-known/jwks.json',
	}),
	audience: 'https://puddlesbackendapi',
	issuer: 'https://dev-qmtahjgk.us.auth0.com/',
	algorithms: ['RS256'],
});
