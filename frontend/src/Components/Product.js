import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
	const { product } = props;
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const addToCartHandler = async (item) => {
		const existItem = cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${item._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry, this product is out of stock.');
			return;
		}

		ctxDispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...item, quantity },
		});
	};

	return (
		<Card className="h-100">
			<Link to={`/product/${product.slug}`}>
				<img
					src={product.images[0]}
					className="card-img-top"
					alt={product.name}
				/>
			</Link>

			<Card.Body className="d-flex flex-column">
				<Link to={`/product/${product.slug}`}>
					<Card.Title>{product.name}</Card.Title>
				</Link>
				{product.rating && product.numReviews ? (
					<Rating rating={product.rating} numReviews={product.numReviews} />
				) : (
					<></>
				)}

				<Card.Text>${product.price}</Card.Text>
				{product.countInStock === 0 ? (
					<Button variant="light" disabled>
						Out of Stock
					</Button>
				) : (
					<Button
						className="mt-auto mx-auto 
				}w-75"
						onClick={() => addToCartHandler(product)}
					>
						Add to cart
					</Button>
				)}
			</Card.Body>
		</Card>
	);
}

export default Product;
