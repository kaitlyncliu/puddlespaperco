import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../Components/CheckoutSteps';

export default function ShippingScreen() {
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { shippingAddress },
		userInfo,
	} = state;

	useEffect(() => {
		if (!userInfo) {
			navigate('/signin?redirect=/shipping');
		}
	}, [userInfo, navigate]);

	const [fullName, setFullName] = useState(shippingAddress.fullName || '');
	const [address, setAddress] = useState(shippingAddress.address || '');
	const [city, setCity] = useState(shippingAddress.city || '');
	const [zipCode, setZipCode] = useState(shippingAddress.zipCode || '');
	const [country, setCountry] = useState(shippingAddress.country || '');

	const submitHandler = (e) => {
		e.preventDefault();

		ctxDispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: {
				fullName,
				address,
				city,
				zipCode,
				country,
			},
		});
		localStorage.setItem(
			'shippingAddress',
			JSON.stringify({ fullName, address, city, zipCode, country })
		);
		navigate('/payment');
	};

	return (
		<div>
			<Helmet>
				<title>Shipping</title>
			</Helmet>
			<CheckoutSteps step1 step2 />
			<div className="container small-container">
				<h1 className="my-3">Shipping</h1>
				<Form onSubmit={submitHandler}>
					<Form.Group className="mb-3" controlId="fullName">
						<Form.Label>Full Name</Form.Label>
						<Form.Control
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
						></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" controlId="address">
						<Form.Label>Address</Form.Label>
						<Form.Control
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							required
						></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" controlId="city">
						<Form.Label>City</Form.Label>
						<Form.Control
							value={city}
							onChange={(e) => setCity(e.target.value)}
							required
						></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" controlId="zipCode">
						<Form.Label>Zip Code</Form.Label>
						<Form.Control
							value={zipCode}
							onChange={(e) => setZipCode(e.target.value)}
							required
						></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" controlId="country">
						<Form.Label>Country</Form.Label>
						<Form.Control
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							required
						></Form.Control>
					</Form.Group>
					<div className="mb-3">
						<Button variant="primary" type="submit">
							Continue to checkout
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
}
