import bcrypt from 'bcryptjs';

const data = {
	users: [
		{
			name: 'Kaitlyn',
			email: 'admin@example.com',
			password: bcrypt.hashSync('123456'),
			isAdmin: true,
		},
		{
			name: 'John',
			email: 'user@example.com',
			password: bcrypt.hashSync('123456'),
			isAdmin: false,
		},
	],

	products: [
		{
			name: 'Peanuts - Anya Forger Keychain',
			slug: 'anya-keychain',
			category: 'Keychains',
			image: '/images/anya.png',
			price: 8.95,
			countInStock: 100,
			rating: '4.3',
			numReviews: '5',
			description: 'A cute keychain',
		},
		{
			name: 'Bready Bakerie',
			slug: 'bread-stickers',
			category: 'Sticker Sheet',
			image: '/images/bread.png',
			price: 3.25,
			countInStock: 100,
			rating: '4.3',
			numReviews: '5',
			description: 'A cute sticker sheet',
		},
		{
			name: 'Forest Friends Sticker Sheet',
			slug: 'forest-stickers',
			category: 'Sticker Sheet',
			image: '/images/forestfriends.png',
			price: 3.25,
			countInStock: 100,
			rating: '4.3',
			numReviews: '5',
			description: 'A cute sticker sheet',
		},
		{
			name: 'Strawberry Delights',
			slug: 'strawberry-stickers',
			category: 'Sticker Sheet',
			image: '/images/strawberry.png',
			price: 3.25,
			countInStock: 100,
			rating: '4.3',
			numReviews: '5',
			description: 'A cute sticker sheet',
		},
	],
};

export default data;
