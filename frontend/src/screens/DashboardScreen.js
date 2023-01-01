import React from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';

export default function DashboardScreen() {
	return (
		<div>
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<Row>
				<Col md={4}></Col>
				<Col md={8}>
					<Row>
						<h1 className="p-3">Summary</h1>
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
				</Col>
			</Row>
		</div>
	);
}
