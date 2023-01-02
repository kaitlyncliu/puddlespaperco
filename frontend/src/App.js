import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { getError } from './util';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from './Store';
import { useContext, useEffect, useState } from 'react';
// Screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import CheckoutSuccessScreen from './screens/CheckoutSuccessScreen';
import SearchScreen from './screens/SearchScreen';
// Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
// Components
import SearchBar from './Components/SearchBar';
import ProtectedRoute from './Components/ProtectedRoute';
import { useAuth0 } from '@auth0/auth0-react';
import DashboardScreen from './screens/DashboardScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ManageOrderScreen from './screens/ManageOrdersScreen';

function App() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { cart } = state;
	const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
		useAuth0();
	const signOutHandler = () => {
		ctxDispatch({ type: 'USER_SIGNOUT' });
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
		logout({ returnTo: window.location.origin });
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
								<i className="fas fa-bars" style={{ color: 'white' }}></i>
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
									{!isLoading & isAuthenticated ? (
										<NavDropdown title={user.name} id="basic-nav-dropdown">
											<LinkContainer to="/profile">
												<NavDropdown.Item>User Profile</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/orderhistory">
												<NavDropdown.Item>My Orders</NavDropdown.Item>
											</LinkContainer>
											<NavDropdown.Divider />
											<NavDropdown.Item onClick={() => signOutHandler()}>
												Logout
											</NavDropdown.Item>
										</NavDropdown>
									) : (
										<Nav.Link
											className="nav-link"
											onClick={() => loginWithRedirect()}
										>
											Sign In
										</Nav.Link>
									)}
									{isAuthenticated && user.isAdmin && (
										<NavDropdown title="Admin" id="admin-nav-dropdown">
											<LinkContainer to="/dashboard">
												<NavDropdown.Item>Dashboard</NavDropdown.Item>
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
							<Route path="/" element={<HomeScreen />} />
							<Route path="/product/:slug" element={<ProductScreen />} />
							<Route path="/cart" element={<CartScreen />} />
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
							<Route
								path="/checkout-success"
								element={<CheckoutSuccessScreen />}
							/>
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<DashboardScreen />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/editProduct/:slug"
								element={
									<ProtectedRoute>
										<ProductEditScreen />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/manageOrders"
								element={
									<ProtectedRoute>
										<ManageOrderScreen></ManageOrderScreen>
									</ProtectedRoute>
								}
							/>
						</Routes>
					</Container>
				</main>
				<footer>
					<div className="text-center">© 2023 Kaitlyn Liu</div>
					<p className="text-center" style={{ fontSize: '0.75rem' }}>
						All rights reserved.
					</p>
				</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
