import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../Components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useReducer } from 'react';
import { Store } from '../Store';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import LoadingBox from '../Components/LoadingBox';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { getError } from '../util';

const orderReducer = (state, action) => {
	switch (action.type) {
		case 'CREATE_REQUEST':
			return { ...state, loading: true };
		case 'CREATE_SUCCESS':
			return { ...state, loading: false };
		case 'CREATE_FAIL':
			return { ...state, loading: false };
		default:
			return state;
	}
};

export default function CartScreen() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const [{ loading }, dispatch] = useReducer(orderReducer, {
		loading: false,
	});
	const {
		user,
		loginWithRedirect,
		isAuthenticated,
		isLoading,
		getAccessTokenSilently,
	} = useAuth0();
	const {
		cart: { cartItems },
	} = state;

	const updateCartHandler = async (item, quantity) => {
		const { data } = await axios.get(`/api/products/${item._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry, this product is out of stock.');
			return;
		}

		ctxDispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...item, quantity: quantity },
		});
	};

	const submitStripeHandler = async (e) => {
		dispatch({ type: 'CREATE_REQUEST' });
		try {
			const token = await getAccessTokenSilently();
			const res = await axios.post(
				'/api/stripe/create-checkout-session',
				{
					cartItems: cartItems,
					userId: user.sub,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			dispatch({ type: 'CREATE_SUCCESS' });
			window.location.href = res.data.url;
		} catch (err) {
			dispatch({ type: 'CREATE_FAIL' });
			toast.error(getError(err));
		}
	};

	const checkoutHandler = () => {
		!isLoading & isAuthenticated ? submitStripeHandler() : loginWithRedirect();
	};

	const removeItemHandler = (item) => {
		ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
	};

	return (
		<div>
			<Helmet>
				<title>Shopping Cart</title>
			</Helmet>
			<h1>Shopping Cart</h1>
			<Row>
				<Col md={8}>
					{cartItems.length === 0 ? (
						<MessageBox>
							Your cart is empty. <Link to="/">Go shopping</Link>
						</MessageBox>
					) : (
						<ListGroup>
							{cartItems.map((item) => (
								<ListGroup.Item key={item._id}>
									<Row className="align-items-center">
										<Col md={4}>
											<img
												src={item.images[0]}
												alt={item.name}
												className="img-fluid rounded img-thumbnail"
											></img>{' '}
											<Link to={`/product/${item.slug}`}>{item.name}</Link>
										</Col>
										<Col md={3}>
											<Button
												variant="light"
												onClick={() =>
													updateCartHandler(item, item.quantity - 1)
												}
												disabled={item.quantity <= 1}
											>
												<i className="fas fa-minus-circle"></i>
											</Button>{' '}
											<span>{item.quantity}</span>
											<Button
												variant="light"
												onClick={() =>
													updateCartHandler(item, item.quantity + 1)
												}
												disabled={item.quantity >= item.countInStock}
											>
												<i className="fas fa-plus-circle"></i>
											</Button>
										</Col>
										<Col md={3}>${item.price}</Col>
										<Col md={2}>
											<Button
												variant="light"
												onClick={() => removeItemHandler(item)}
											>
												<i className="fas fa-trash"></i>
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h3>
										Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
										items) : $
										{cartItems
											.reduce((a, c) => a + c.price * c.quantity, 0)
											.toFixed(2)}
									</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<div className="d-grid">
										<Button
											type="button"
											variant="primary"
											onClick={checkoutHandler}
											disabled={cartItems.length === 0}
										>
											Proceed to Checkout
										</Button>
									</div>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
