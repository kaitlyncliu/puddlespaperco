import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Rating from './Rating';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import Carousel from 'react-bootstrap/Carousel';
import { useCallback, useEffect, useState } from 'react';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../util';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function ProductEdit(props) {
	const { product, categories } = props;

	const [show, setShow] = useState(false);
	const [itemName, setItemName] = useState(product.name);
	const [itemPrice, setItemPrice] = useState(product.price);
	const [itemCategory, setItemCategory] = useState(product.category);
	const [itemDescription, setItemDescription] = useState(product.description);
	const [itemCount, setItemCount] = useState(product.countInStock);
	const [itemImages, setItemImages] = useState(product.images);
	const [imageIndex, setImageIndex] = useState(0);
	const [imageFiles, setImageFiles] = useState([]);

	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const handleSelect = (selectedIndex, e) => {
		setImageIndex(selectedIndex);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			const { success } = await axios.put('api/products/edit', {
				itemId: product._id,
				itemName: itemName,
				itemPrice: itemPrice,
				itemCategory: itemCategory,
				itemDescription: itemDescription,
				itemCount: itemCount,
				itemImages: itemImages,
			});
			toast.success('Product updated!');
		} catch (err) {
			toast.error(getError(err));
		}
	};

	useEffect(() => {
		if (imageFiles.length < 1) return;
		const newImageURLs = [];
		imageFiles.forEach((image) =>
			newImageURLs.push(URL.createObjectURL(image))
		);
		setItemImages((prevImages) => [...prevImages, ...newImageURLs]);
	}, [imageFiles]);

	const handleImageChange = (e) => {
		setImageFiles([...e.target.files]);
	};

	const handleOnDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(itemImages);

		//Changing the position of Array element
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		//Updating the list
		setItemImages(items);
	};
	console.log(itemImages);

	return (
		<>
			<Card className="h-100">
				<img
					src={product.images[0]}
					className="card-img-top"
					alt={product.name}
				/>
				<i
					className="far fa-edit"
					onClick={handleShow}
					style={{ position: 'absolute', top: '7px', right: '7px' }}
				></i>

				<Card.Body className="d-flex flex-column">
					<Link to={`/product/${product.slug}`}>
						<Card.Title>{product.name}</Card.Title>
					</Link>
					<Rating rating={product.rating} numReviews={product.numReviews} />
					<Card.Text>${product.price}</Card.Text>
				</Card.Body>
			</Card>
			<Modal
				size="xl"
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Editing {product.name}</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleSave}>
					<Modal.Body>
						<Row>
							<Col md={6}>
								<DragDropContext onDragEnd={handleOnDragEnd}>
									<h2>Image Preview</h2>
									<Carousel
										interval={null}
										activeIndex={imageIndex}
										onSelect={handleSelect}
									>
										{itemImages.map((image) => (
											<Carousel.Item key={image}>
												<img
													className="d-block w-100 rounded-3"
													src={image}
													alt={product.name}
												></img>
											</Carousel.Item>
										))}
									</Carousel>
									<Form.Group className="mb-3">
										<Form.Label>Upload product images</Form.Label>
										<Form.Control
											type="file"
											multiple
											accept="image/*"
											onChange={handleImageChange}
										/>
									</Form.Group>
									<p>Reorder Images</p>
									<Droppable
										droppableId="editImagesDroppable"
										direction="horizontal"
									>
										{(provided) => (
											<Row
												className="editImages p-2"
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{itemImages.map((image, index) => (
													<Draggable
														key={`${image}-draggable`}
														draggableId={`${image}-draggable`}
														index={index}
													>
														{(provided) => (
															<Col
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																md={2}
															>
																<img
																	className="img-fluid"
																	src={image}
																	alt={product.name}
																></img>
															</Col>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</Row>
										)}
									</Droppable>
								</DragDropContext>
							</Col>
							<Col md={6}>
								<h2>Product Details</h2>
								<Form.Group className="mb-3">
									<Form.Label>Product Name</Form.Label>
									<Form.Control
										type="text"
										size="md"
										value={itemName}
										required
										onChange={(e) => setItemName(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Price ($)</Form.Label>
									<Form.Control
										min="0.01"
										step="0.01"
										max="250"
										type="number"
										value={itemPrice}
										required
										onChange={(e) => setItemPrice(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Quantity</Form.Label>
									<Form.Control
										min="0"
										step="1"
										max="100"
										type="number"
										value={itemCount}
										required
										onChange={(e) => setItemCount(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Description</Form.Label>
									<Form.Control
										as="textarea"
										size="sm"
										value={itemDescription}
										required
										onChange={(e) => setItemDescription(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group>
									<Form.Label>Category</Form.Label>
									<Form.Control
										as="select"
										value={itemCategory}
										onChange={(e) => setItemCategory(e.target.value)}
									>
										{categories.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</Form.Control>
								</Form.Group>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit" variant="secondary">
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}

export default ProductEdit;
