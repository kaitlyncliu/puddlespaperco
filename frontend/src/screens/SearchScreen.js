import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../util.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import Product from '../Components/Product';
import { LinkContainer } from 'react-router-bootstrap';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				products: action.payload.products,
				page: action.payload.page,
				pages: action.payload.pages,
				countProducts: action.payload.countProducts,
				loading: false,
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };

		default:
			return state;
	}
};

export default function SearchScreen() {
	const navigate = useNavigate();
	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const category = sp.get('category') || 'all';
	const query = sp.get('query') || 'all';
	const order = sp.get('order') || 'newest';
	const page = sp.get('page') || 1;

	const [{ loading, error, products, pages, countProducts }, dispatch] =
		useReducer(reducer, { loading: true, error: '' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					`/api/products/search?page=${page}&query=${query}&category=${category}&order=${order}`
				);
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		fetchData();
	}, [category, page, query, order]);

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
	}, [dispatch]);

	const getFilterUrl = (filter) => {
		const filterPage = filter.page || page;
		const filterCategory = filter.category || category;
		const filterQuery = filter.query || query;
		const sortOrder = filter.order || order;
		return `/search?category=${filterCategory}&query=${filterQuery}&order=${sortOrder}&page=${filterPage}`;
	};

	return (
		<div>
			<Helmet>
				<title>Search Products</title>
			</Helmet>
			<Row>
				<Col md={3}>
					<h3>Category</h3>
					<div>
						<ul>
							<li>
								<Link
									className={
										('all' === category ? 'text-bold ' : '') +
										'text-decoration-none'
									}
									to={getFilterUrl({ category: 'all' })}
								>
									All Products
								</Link>
							</li>
							{categories.map((c) => (
								<li key={c}>
									<Link
										className={
											(c === category ? 'text-bold' : '') +
											'text-decoration-none'
										}
										to={getFilterUrl({ category: c })}
									>
										{c}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</Col>
				<Col md={9}>
					{loading ? (
						<LoadingBox></LoadingBox>
					) : error ? (
						<MessageBox variant="danger">{error}</MessageBox>
					) : (
						<>
							<Row className="justify-content-between mb-3">
								<Col md={6}>
									<div>
										{countProducts === 0 ? 'No' : countProducts} Results
										{query !== 'all' && ' : ' + query}
										{category !== 'all' && ' : ' + category}
										{query !== 'all' || category !== 'all' ? (
											<Button
												variant="light"
												onClick={() => navigate('/search')}
											>
												<i className="fas fa-times-circle"></i>
											</Button>
										) : null}
									</div>
								</Col>
								<Col md={3} className="text-end">
									<select
										value={order}
										className="form-select form-select-sm"
										onChange={(e) => {
											navigate(getFilterUrl({ order: e.target.value }));
										}}
									>
										<option selected>Sort by</option>
										<option value="newest">New Arrivals</option>
										<option value="lowest">Price: Low to High</option>
										<option value="highest">Price: High to Low</option>
										<option value="toprated">Top Rated</option>
									</select>
								</Col>
							</Row>
							{products.length === 0 && (
								<MessageBox>No Products Found</MessageBox>
							)}
							<Row>
								{products.map((product) => (
									<Col sm={6} lg={4} className="mb-3" key={product._id}>
										<Product product={product}></Product>
									</Col>
								))}
							</Row>

							<div>
								{[...Array(pages).keys()].map((x) => (
									<LinkContainer
										key={x + 1}
										className="mx-1"
										to={getFilterUrl({ page: x + 1 })}
									>
										<Button
											className={Number(page) === x + 1 ? 'text-bold' : ''}
											variant="light"
										>
											{x + 1}
										</Button>
									</LinkContainer>
								))}
							</div>
						</>
					)}
				</Col>
			</Row>
		</div>
	);
}
