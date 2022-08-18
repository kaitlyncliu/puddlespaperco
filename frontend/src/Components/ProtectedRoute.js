import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';
import { useAuth0 } from '@auth0/auth0-react';

export default function ProtectedRoute({ children }) {
	const { state } = useContext(Store);
	const { userInfo } = state;
	const { loginWithRedirect, isAuthenticated } = useAuth0();

	return isAuthenticated ? children : loginWithRedirect();
}
