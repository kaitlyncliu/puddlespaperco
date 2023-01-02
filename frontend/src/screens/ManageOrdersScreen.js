import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import ListGroup from 'react-bootstrap/ListGroup';
import Order from '../Components/Order';
import MessageBox from '../Components/MessageBox';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_PENDING_REQUEST':
			return { ...state, pendingLoading: true };
		case 'FETCH_COMPLETE_REQUEST':
			return { ...state, completeLoading: true };
		case 'FETCH_PENDING_SUCCESS':
			return { ...state, pendingOrders: action.payload, pendingLoading: false };
		case 'FETCH_COMPLETE_SUCCESS':
			return {
				...state,
				completeOrders: action.payload,
				completeLoading: false,
			};
		case 'FETCH_PENDING_FAIL':
			return { ...state, pendingLoading: false, pendingError: action.payload };
		case 'FETCH_COMPLETE_FAIL':
			return {
				...state,
				completeLoading: false,
				completeError: action.payload,
			};
		default:
			return state;
	}
};

export default function ManageOrderScreen() {
	const [
		{
			pendingLoading,
			completeLoading,
			pendingError,
			completeError,
			pendingOrders,
			completeOrders,
		},
		dispatch,
	] = useReducer(reducer, {
		pendingOrders: [],
		completedOrders: [],
		pendingLoading: true,
		completeLoading: true,
		pendingError: '',
		completeError: '',
	});
	const { getAccessTokenSilently, user } = useAuth0();

	useEffect(() => {
		const fetchPending = async () => {
			dispatch({ type: 'FETCH_PENDING_REQUEST' });
			try {
				const token = await getAccessTokenSilently();
				const result = await axios.get('/api/orders/pending', {
					params: {
						userId: user.sub,
					},
					headers: { Authorization: `Bearer ${token}` },
				});
				dispatch({ type: 'FETCH_PENDING_SUCCESS', payload: result.data });
			} catch (err) {
				dispatch({ type: 'FETCH_PENDING_FAIL', payload: err.message });
			}
		};
		const fetchComplete = async () => {
			const token = await getAccessTokenSilently();
			dispatch({ type: 'FETCH_COMPLETE_REQUEST' });
			try {
				const result = await axios.get('/api/orders/complete', {
					params: {
						userId: user.sub,
					},
					headers: { Authorization: `Bearer ${token}` },
				});
				dispatch({ type: 'FETCH_COMPLETE_SUCCESS', payload: result.data });
			} catch (err) {
				dispatch({ type: 'FETCH_COMPLETE_FAIL', payload: err.message });
			}
		};
		fetchPending();
		fetchComplete();
	}, [getAccessTokenSilently, user]);
	return (
		<div>
			<Helmet>
				<title>Manage Orders</title>
			</Helmet>
			<h1 className="p-3">Manage Orders</h1>
			<Tabs defaultActiveKey="pending">
				<Tab eventKey="pending" title="Pending">
					{pendingLoading ? (
						<img src="/images/loadingGif.gif" alt="loading..." />
					) : pendingError ? (
						<MessageBox variant="danger">{pendingError}</MessageBox>
					) : (
						<ListGroup>
							{pendingOrders.map((order) => (
								<Order order={order}></Order>
							))}
						</ListGroup>
					)}
				</Tab>
				<Tab eventKey="complete" title="Complete">
					{completeLoading ? (
						<img src="/images/loadingGif.gif" alt="loading..." />
					) : completeError ? (
						<MessageBox variant="danger">{completeError}</MessageBox>
					) : (
						<ListGroup>
							{completeOrders.map((order) => (
								<Order order={order}></Order>
							))}
						</ListGroup>
					)}
				</Tab>
			</Tabs>
		</div>
	);
}
