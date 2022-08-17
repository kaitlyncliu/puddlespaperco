import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import { getError } from '../util';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return {
				...state,
				loading: true,
				error: '',
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				error: '',
				order: action.payload,
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };

		default:
			return state;
	}
}

export default function OrderScreen() {
	const navigate = useNavigate();
	const params = useParams();
	const { user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
	const { id: orderId } = params;
	const [{ loading, error, order }, dispatch] = useReducer(reducer, {
		loading: true,
		order: {},
		error: '',
		successPay: false,
		loadingPay: false,
	});

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const token = await getAccessTokenSilently();
				const { data } = await axios.get(`/api/orders/${orderId}`, {
					headers: { authorization: `Bearer ${token}` },
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
				toast.error(getError(err));
			}
		};
		if (!user) {
			loginWithRedirect();
		} else {
			fetchOrder();
		}
	}, [
		order,
		user,
		orderId,
		navigate,
		loginWithRedirect,
		getAccessTokenSilently,
	]);

	return loading ? (
		<LoadingBox></LoadingBox>
	) : error ? (
		<MessageBox variant="danger">{error}</MessageBox>
	) : (
		<div>
			<Helmet>
				<title>Order {orderId}</title>
			</Helmet>
			<h1 className="my-3">Order {orderId}</h1>
			<Row>
				<Col md={8}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Shipping</Card.Title>
							<Card.Text>
								<strong>Name: </strong> {order.shippingAddress.fullName} <br />
								<strong>Address: </strong> {order.shippingAddress.address},
								{order.shippingAddress.city}, {order.shippingAddress.zipCode},
								{order.shippingAddress.country}
							</Card.Text>
							{order.isDelivered ? (
								<MessageBox variant="success">
									Delivered at {order.deliveredAt}
								</MessageBox>
							) : (
								<MessageBox variant="danger">Not delivered</MessageBox>
							)}
						</Card.Body>
					</Card>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Payment</Card.Title>
							<Card.Text>
								<strong>Method: </strong> {order.paymentMethod}
							</Card.Text>
							{order.isPaid ? (
								<MessageBox variant="success">
									Paid at {order.paidAt}
								</MessageBox>
							) : (
								<MessageBox variant="danger">Not Paid</MessageBox>
							)}
						</Card.Body>
					</Card>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Your Order:</Card.Title>
							<ListGroup variant="flush">
								{order.orderItems.map((item) => (
									<ListGroup.Item key={item._id}>
										<Row className="align-items-center">
											<Col md={6}>
												<img
													src={item.image}
													alt={item.name}
													className="img-fluid rounded img-thumbnail"
												></img>{' '}
												<Link to={`/product/${item.slug}`}>{item.name}</Link>
											</Col>
											<Col md={3}>
												<span>{item.quantity}</span>
											</Col>
											<Col md={3}>${item.price}</Col>
										</Row>
									</ListGroup.Item>
								))}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Order Summary</Card.Title>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Row>
										<Col>Items</Col>
										<Col>${order.itemsPrice.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Shipping</Col>
										<Col>${order.shippingPrice.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Tax</Col>
										<Col>${order.taxPrice.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>
											<b>Order Total</b>
										</Col>
										<Col>${order.totalPrice.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
