import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../Components/CheckoutSteps';
import { Store } from '../Store';

export default function CheckoutSuccessScreen() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	// const { cart, userInfo } = state;
	// const [{ loading }, dispatch] = useReducer(reducer, {
	// 	loading: false,
	// });

	// const placeOrderHandler = async () => {
	// 	try {
	// 		dispatch({ type: 'CREATE_REQUEST' });

	// 		const { data } = await Axios.post(
	// 			'/api/orders',
	// 			{
	// 				orderItems: cart.cartItems,
	// 				shippingAddress: cart.shippingAddress,
	// 				paymentMethod: cart.paymentMethod,
	// 				itemsPrice: cart.itemsPrice,
	// 				shippingPrice: cart.shippingPrice,
	// 				taxPrice: cart.shippingPrice,
	// 				totalPrice: cart.totalPrice,
	// 			},
	// 			{
	// 				headers: {
	// 					authorization: `Bearer ${userInfo.token}`,
	// 				},
	// 			}
	// 		);
	// 		ctxDispatch({ type: 'CART_CLEAR' });
	// 		dispatch({ type: 'CREATE_SUCCESS' });
	// 		localStorage.removeItem('cartItems');
	// 		navigate(`/order/${data.order._id}`);
	// 	} catch (err) {
	// 		dispatch({ type: 'CREATE_FAIL' });
	// 		toast.error(getError(err));
	// 	}
	// };

	useEffect(() => {
		ctxDispatch({ type: 'CART_CLEAR' });
		localStorage.removeItem('cartItems');
	}, []);

	return (
		<div>
			<Helmet>
				<title>Order Placed!</title>
			</Helmet>
			<CheckoutSteps step1 step2 step3 step4 />
			<h1>Thanks for your order!</h1>
		</div>
	);
}
