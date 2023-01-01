import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function SearchBar() {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');
	const submitHandler = (e) => {
		e.preventDefault();
		navigate(query ? `/search/?query=${query}` : '/search');
	};

	return (
		<Form className="d-flex w-50 me-auto" onSubmit={submitHandler}>
			<InputGroup className="">
				<FormControl
					type="text"
					name="q"
					id="q"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search for a product..."
					aria-label="Search Products"
					aria-describedby="button-search"
				></FormControl>
				<Button variant="outline-primary" type="submit" id="button-search">
					<i className="fas fa-search" style={{ color: 'white' }}></i>
				</Button>
			</InputGroup>
		</Form>
	);
}
