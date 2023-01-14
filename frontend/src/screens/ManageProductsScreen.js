import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../Components/MessageBox';
import ProductEdit from '../Components/ProductEdit';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import { createFormData, getError } from '../util';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				products: action.payload,
				categories: action.categoryPayload,
				loading: false,
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default function ManageProductsScreen() {
	const [{ loading, error, products, categories }, dispatch] = useReducer(
		reducer,
		{
			products: [],
			categories: [],
			loading: true,
			error: '',
		}
	);
	const [show, setShow] = useState(false);
	const [itemName, setItemName] = useState('');
	const [itemPrice, setItemPrice] = useState(1.0);
	const [itemCategory, setItemCategory] = useState();
	const [itemDescription, setItemDescription] = useState('');
	const [itemCount, setItemCount] = useState();
	const [itemSlug, setItemSlug] = useState();
	const [itemImages, setItemImages] = useState([]);
	const [imageIndex, setImageIndex] = useState(0);
	const [imageFiles, setImageFiles] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			try {
				const result = await axios.get('/api/products');
				const categoryResult = await axios.get('/api/products/categories');
				dispatch({
					type: 'FETCH_SUCCESS',
					payload: result.data,
					categoryPayload: categoryResult.data,
				});
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: err.message });
			}
		};
		fetchData();
	}, []);

	const handleShow = () => {
		setShow(true);
	};
	const handleClose = () => {
		setItemName('');
		setItemPrice(1.0);
		setItemDescription('');
		setItemCount(0);
		setItemImages([]);
		setImageIndex(0);
		setImageFiles([]);
		setShow(false);
	};

	const handleSelect = (selectedIndex, e) => {
		setImageIndex(selectedIndex);
	};
	const handleSave = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			const info = {
				itemName: itemName,
				itemPrice: itemPrice,
				itemCategory: itemCategory,
				itemDescription: itemDescription,
				itemCount: itemCount,
				itemImages: itemImages,
				imageFiles: imageFiles,
			};
			createFormData(formData, info);
			formData.append('itemSlug', itemSlug);
			const { data } = await axios.post('api/products/new', formData);
			setItemImages(data);
			toast.success('Product created!');
		} catch (err) {
			toast.error(getError(err));
		}
	};

	const handleImageChange = (e) => {
		const image = e.target.files[0];
		const newImageURL = URL.createObjectURL(image);
		image.src = newImageURL;
		setImageFiles([...imageFiles, image]);
		setItemImages([...itemImages, newImageURL]);
		e.target.value = null;
	};

	const handleDelete = (image) => {
		const newImages = Array.from(itemImages);
		const currImgIndex = newImages.findIndex((img) => img === image);
		newImages.splice(currImgIndex, 1);
		setItemImages(newImages);
		if (image.startsWith('blob')) {
			const newFiles = Array.from(imageFiles);
			const currFileIndex = newFiles.findIndex((img) => img.src === image);
			newFiles.splice(currFileIndex, 1);
			setImageFiles(newFiles);
		}
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

	return (
		<>
			<Helmet>Manage Products</Helmet>
			<h1>Manage Products</h1>
			<div className="products">
				{loading ? (
					<img src="/images/loadingGif.gif" alt="my-gif" />
				) : error ? (
					<MessageBox variant="danger">{error}</MessageBox>
				) : (
					<Row>
						{products.map((product) => (
							<Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
								<ProductEdit
									product={product}
									categories={categories}
								></ProductEdit>
							</Col>
						))}
						<Grid container justifyContent="flex-end">
							<Fab
								variant="extended"
								color="primary"
								aria-label="add"
								onClick={handleShow}
							>
								<AddIcon />
								New Product
							</Fab>
						</Grid>
					</Row>
				)}
			</div>
			<Modal
				size="xl"
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>New Product</Modal.Title>
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
													alt="Product"
												></img>
											</Carousel.Item>
										))}
									</Carousel>
									<Form.Group className="mb-3">
										<Form.Label>Upload product images</Form.Label>
										<Form.Control
											type="file"
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
														image={image}
													>
														{(provided) => (
															<Col
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																md={2}
																image={image}
															>
																<div
																	style={{
																		display: 'flex',
																	}}
																	image={image}
																>
																	<img
																		className="img-fluid"
																		src={image}
																		alt="New product preview"
																	></img>

																	<span
																		className="delete-btn"
																		onClick={() => handleDelete(image)}
																	>
																		&times;
																	</span>
																</div>
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
								<Form.Group className="mb-3" controlId="productName">
									<Form.Label>Product Name</Form.Label>
									<Form.Control
										type="text"
										size="md"
										value={itemName}
										required
										onChange={(e) => setItemName(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group className="mb-3" controlId="productSlug">
									<Form.Label>Product SKU</Form.Label>
									<Form.Control
										type="text"
										size="md"
										placeholder="SKU"
										value={itemSlug}
										required
										onChange={(e) => setItemSlug(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group className="mb-3" controlId="productPrice">
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
								<Form.Group className="mb-3" controlId="productCount">
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
								<Form.Group className="mb-3" controlId="productDescription">
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
										controlId="productCategory"
										value={itemCategory}
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
						<Button type="submit" variant="secondary" onClick={handleSave}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
