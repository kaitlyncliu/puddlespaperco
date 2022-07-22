import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import { useContext, useEffect, useState } from 'react';
import CartScreen from './screens/CartScreen';
import SignInScreen from './screens/SignInScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingScreen from './screens/ShippingScreen';
import SignUpScreen from './screens/SignUpScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { getError } from './util';
import axios from 'axios';
import SearchBar from './Components/SearchBar';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { cart, userInfo } = state;

	const signOutHandler = () => {
		ctxDispatch({ type: 'USER_SIGNOUT' });
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
		window.location.href = '/signin';
	};

	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data } = await axios.get(`/api/products/categories`);
				setCategories(data);
			} catch (err) {
				toast.error(getError(err));
			}
		};
		fetchCategories();
	}, []);

	return (
		<BrowserRouter>
			<div
				className={
					sidebarIsOpen
						? 'd-flex flex-column site-container active-cont'
						: 'd-flex flex-column site-container'
				}
			>
				<ToastContainer position="bottom-center" limit={1} />
				<header>
					<Navbar bg="dark" variant="dark" expand="lg">
						<Container style={{ color: 'blue' }}>
							<Button
								variant="dark"
								onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
							>
								<i className="fas fa-bars"></i>
							</Button>
							<LinkContainer to="/">
								<Navbar.Brand className="p-2">PuddlesPaperCo</Navbar.Brand>
							</LinkContainer>
							<Navbar.Toggle aria-controls="basic-navbar-nav" />
							<Navbar.Collapse id="basic-navbar-nav">
								<SearchBar />
								<Nav className="me-auto w-100 justify-content-end">
									<Link to="/cart" className="nav-link">
										Cart
										{cart.cartItems.length > 0 && (
											<Badge pill bg="danger">
												{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
											</Badge>
										)}
									</Link>
									{userInfo ? (
										<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
											<LinkContainer to="/profile">
												<NavDropdown.Item>User Profile</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/orderhistory">
												<NavDropdown.Item>My Orders</NavDropdown.Item>
											</LinkContainer>
											<NavDropdown.Divider />
											<Link
												className="dropdown-item"
												to="#signout"
												onClick={signOutHandler}
											>
												Sign Out
											</Link>
										</NavDropdown>
									) : (
										<Link className="nav-link" to="/signin">
											Sign In
										</Link>
									)}
									{userInfo && userInfo.isAdmin && (
										<NavDropdown title="Admin" id="admin-nav-dropdown">
											<LinkContainer to="/dashboard">
												<NavDropdown.Item>Dashboard</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/productList">
												<NavDropdown.Item>Products</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/orderList">
												<NavDropdown.Item>Orders</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/userList">
												<NavDropdown.Item>Users</NavDropdown.Item>
											</LinkContainer>
										</NavDropdown>
									)}
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>
				</header>
				<div
					className={
						sidebarIsOpen
							? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
							: 'side-navbar d-flex justify-content-between flex-wrap flex-column'
					}
				>
					<Nav className="flex-column text-white w-100 p-2">
						<Nav.Item className="p-2">
							<strong>Categories</strong>
						</Nav.Item>
						{categories.map((category) => (
							<Nav.Item key={category}>
								<LinkContainer
									className="custom-link-container p-2"
									to={`/search?category=${category}`}
									onClick={() => setSidebarIsOpen(false)}
								>
									<Nav.Link>{category}</Nav.Link>
								</LinkContainer>
							</Nav.Item>
						))}
					</Nav>
				</div>
				<main>
					<Container className="mt-3">
						<Routes>
							<Route path="/product/:slug" element={<ProductScreen />} />
							<Route path="/" element={<HomeScreen />} />
							<Route path="/cart" element={<CartScreen />} />
							<Route path="/signin" element={<SignInScreen />} />
							<Route path="/shipping" element={<ShippingScreen />} />
							<Route path="/signup" element={<SignUpScreen />} />
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<ProfileScreen />
									</ProtectedRoute>
								}
							/>
							<Route path="/payment" element={<PaymentMethodScreen />} />
							<Route path="/placeorder" element={<PlaceOrderScreen />} />
							<Route
								path="/order/:id"
								element={
									<ProtectedRoute>
										<OrderScreen />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/orderhistory"
								element={
									<ProtectedRoute>
										<OrderHistoryScreen />
									</ProtectedRoute>
								}
							/>
							<Route path="/search" element={<SearchScreen />} />
							<Route path="/paid" />
						</Routes>
					</Container>
				</main>
				<footer>
					<div className="text-center">All rights reserved</div>
				</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
