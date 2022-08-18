import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../Components/CheckoutSteps';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../util';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingBox from '../Components/LoadingBox';

const reducer = (state, action) => {
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

export default function PaymentMethodScreen() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { getAccessTokenSilently } = useAuth0();
	const [{ loading }, dispatch] = useReducer(reducer, {
		loading: false,
	});
	const {
		cart: { paymentMethod, cartItems },
		userInfo,
	} = state;
	const [paymentMethodName, setPaymentMethod] = useState(
		paymentMethod || 'PayPal'
	);

	// useEffect(() => {
	// 	if (!shippingAddress.address) {
	// 		navigate('/shipping');
	// 	}
	// }, [shippingAddress, navigate]);

	const submitStripeHandler = async (e) => {
		const token = getAccessTokenSilently();
		e.preventDefault();
		try {
			dispatch({ type: 'CREATE_REQUEST' });
			const res = await axios.post(
				'/api/create-checkout-session',
				{
					cartItems: cartItems,
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

	const submitPaypalHandler = (e) => {
		e.preventDefault();
		ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
		console.log(paymentMethodName);
		localStorage.setItem('paymentMethod', paymentMethodName);
		navigate('/shipping');
	};

	return (
		<div>
			<CheckoutSteps step1 step2></CheckoutSteps>
			<div className="container small-container">
				<Helmet>
					<title>Payment Method</title>
				</Helmet>
				<h1 className="my-3">Payment Method</h1>
				<Form
					onSubmit={
						paymentMethodName === 'PayPal'
							? submitPaypalHandler
							: submitStripeHandler
					}
				>
					<div className="mb-3">
						<Form.Check
							type="radio"
							id="PayPal"
							label="PayPal"
							value="PayPal"
							checked={paymentMethodName === 'PayPal'}
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<Form.Check
							type="radio"
							id="Stripe"
							label="Stripe"
							value="Stripe"
							checked={paymentMethodName === 'Stripe'}
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<Button type="submit">Continue</Button>
						{loading && <LoadingBox></LoadingBox>}
					</div>
				</Form>
			</div>
		</div>
	);
}
