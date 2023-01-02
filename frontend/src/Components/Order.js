import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';

export default function Order(props) {
	const { order } = props;
	return (
		<div>
			<ListGroup.Item className="p-3 mb-3">
				<Row>
					<Col md={3}>
						<Image className="thumbnail w-50" src="/images/anya.png"></Image>
					</Col>
					<Col md={2}>{order.shipping.name}</Col>
					<Col md={2}>{order.shipping.address.line1}</Col>
					<Col md={2}>{order.createdAt}</Col>
					<Col md={2}>
						<li>item1 x1</li>
						<li>item2 x2</li>
						<li>item3 x3</li>
					</Col>
					<Col md={1}>
						<i className="far fa-edit"></i>
					</Col>
					{/* while items less than 4 and items in range len order items list them out*/}
				</Row>
			</ListGroup.Item>
		</div>
	);
}
