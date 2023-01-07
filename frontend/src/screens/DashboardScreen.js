import React from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import Order from '../Components/Order';

export default function DashboardScreen() {
	return (
		<div>
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<Row>
				<Col md={4}>
					<h3 className="p-3">Manage Shop</h3>
					<Card>
						<Row className="no-gutters">
							<Col md={4}>
								<i className="fas fa-shapes fa-2x p-4"></i>
							</Col>
							<Col md={8} className="my-auto">
								<Link to="/manageProducts">
									<p
										className="text-center mb-0"
										style={{ fontSize: '1.25em' }}
									>
										Products
									</p>
								</Link>
							</Col>
						</Row>
					</Card>
					<Card>
						<Row className="no-gutters">
							<Col md={4}>
								<i className="fas fa-shopping-basket fa-2x p-4"></i>
							</Col>
							<Col md={8} className="my-auto">
								<Link to="/manageOrders">
									<p
										className="text-center mb-0"
										style={{ fontSize: '1.25em' }}
									>
										Orders
									</p>
								</Link>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col md={8}>
					<Row>
						<h1 className="p-3">Shop Summary</h1>
						<Col>
							<Card className="align-items-center">
								<Card.Body>
									<i className="fas fa-shopping-basket fa-5x p-4"></i>
									<Card.Title className="text-center p-4">Orders</Card.Title>
									<h1 className="text-center">50</h1>
								</Card.Body>
							</Card>
						</Col>
						<Col>
							<Card className="align-items-center">
								<Card.Body>
									<i className="fa fa-regular fa-money-bill-wave fa-5x p-4"></i>
									<Card.Title className="text-center p-4">Revenue</Card.Title>
									<h1 className="text-center">$1000</h1>
								</Card.Body>
							</Card>
						</Col>
						<Col>
							<Card className="align-items-center">
								<Card.Body>
									<i className="fa fa-solid fa-eye fa-5x p-4"></i>
									<Card.Title className="text-center p-4">Visits</Card.Title>
									<h1 className="text-center">3000</h1>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<Row>
						<h1 className="p-3">Recent Orders</h1>
						<ListGroup>
							{/* <Order></Order>
							<Order></Order> */}
						</ListGroup>
					</Row>
				</Col>
			</Row>
		</div>
	);
}
