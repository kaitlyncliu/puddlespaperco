import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import multer from 'multer';

const productRouter = express.Router();

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		//ensure that this folder already exists in your project directory
		cb(null, '../frontend/public/images');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({ storage: storage });

productRouter.get('/', async (req, res) => {
	const products = await Product.find();
	res.send(products);
});

const PAGE_SIZE = 3;
productRouter.get(
	'/search',
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const pageSize = query.pageSize || PAGE_SIZE;
		const page = query.page || 1;
		const category = query.category || '';
		const order = query.order || '';
		const searchQuery = query.query || '';
		const priceFilter = {};
		const ratingsFilter = {};

		const queryFilter =
			searchQuery && searchQuery !== 'all'
				? {
						name: {
							$regex: searchQuery,
							$options: 'i',
						},
				  }
				: {};

		const categoryFilter =
			category && category !== 'all'
				? {
						category,
				  }
				: {};

		const sortOrder =
			order === 'featured'
				? { featured: -1 }
				: order === 'lowest'
				? { price: 1 }
				: order === 'highest'
				? { price: -1 }
				: order === 'toprated'
				? { rating: -1 }
				: order === 'newest'
				? { createdAt: -1 }
				: { _id: -1 };

		const products = await Product.find({
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingsFilter,
		})
			.sort(sortOrder)
			.skip(pageSize * (page - 1))
			.limit(pageSize);

		const countProducts = await Product.countDocuments({
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingsFilter,
		});

		res.send({
			products,
			countProducts,
			page,
			pages: Math.ceil(countProducts / pageSize),
		});
	})
);

productRouter.get(
	'/categories',
	expressAsyncHandler(async (req, res) => {
		const categories = await Product.find().distinct('category');
		res.send(categories);
	})
);

productRouter.post(
	'/new',
	upload.array('imageFiles[]'),
	expressAsyncHandler(async (req, res) => {
		try {
			const productImages = req.body.itemImages;
			for (var i = 0; i < productImages.length; i++) {
				const im = productImages[i];
				if (im.startsWith('blob')) {
					const newFile = req.files[req.body.itemIndices[i]];
					productImages.splice(i, 1, '/images/' + newFile.filename);
				}
			}
			const product = new Product({
				slug: req.body.itemSlug,
				name: req.body.itemName,
				images: productImages,
				category: req.body.itemCategory,
				description: req.body.itemDescription,
				price: parseFloat(req.body.itemPrice),
				countInStock: parseInt(req.body.itemCount),
			});
			const newProduct = await product.save();
			res.send(productImages);
		} catch (error) {
			res.send(error);
		}
	})
);

productRouter.put(
	'/edit',
	upload.array('imageFiles[]'),
	expressAsyncHandler(async (req, res) => {
		const product = await Product.findById(req.body.itemId);
		if (product) {
			product.images = req.body.itemImages || product.images;
			// replacing images with correct urls after saved
			if (req.files && req.body.itemImages) {
				for (var i = 0; i < product.images.length; i++) {
					const im = product.images[i];
					if (im.startsWith('blob')) {
						const newFile = req.files[req.body.itemIndices[i]];
						product.images.splice(i, 1, '/images/' + newFile.filename);
					}
				}
			}

			product.category = req.body.itemCategory || product.category;
			product.description = req.body.itemDescription || product.description;
			product.price = parseFloat(req.body.itemPrice) || product.price;
			product.countInStock =
				parseInt(req.body.itemCount) || product.countInStock;
			const updatedProduct = await product.save();
			res.send(product.images);
		} else {
			res.status(404).send({ message: 'Product not found' });
		}
	})
);

productRouter.get('/slug/:slug', async (req, res) => {
	const product = await Product.findOne({ slug: req.params.slug });
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({ message: 'Product Not Found' });
	}
});

productRouter.get('/:id', async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({ message: 'Product Not Found' });
	}
});

export default productRouter;
