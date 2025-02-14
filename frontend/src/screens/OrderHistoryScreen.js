import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import Button from 'react-bootstrap/Button';
import { getError } from '../util';
import { useAuth0 } from '@auth0/auth0-react';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, orders: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default function OrderHistoryScreen() {
	const navigate = useNavigate();
	const { getAccessTokenSilently, user } = useAuth0();

	const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
	});
	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			try {
				const token = await getAccessTokenSilently();
				const { data } = await axios.get(`/api/orders/mine`, {
					params: {
						userId: user.sub,
					},
					headers: { Authorization: `Bearer ${token}` },
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (error) {
				dispatch({
					type: 'FETCH_FAIL',
					payload: getError(error),
				});
			}
		};
		fetchData();
	}, [getAccessTokenSilently, user.sub]);
	return (
		<div>
			<Helmet>
				<title>Order History</title>
			</Helmet>

			<h1>Order History</h1>
			{loading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<table className="table">
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Date</th>
							<th>Total</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>{order._id}</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>
									{(order.total / 100).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD',
									})}
								</td>
								<td>
									{order.isDelivered ? order.deliveryStatus : 'Not delivered'}
								</td>
								<td>
									<Button
										type="button"
										variant="light"
										onClick={() => {
											navigate(`/order/${order._id}`);
										}}
									>
										Details
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
