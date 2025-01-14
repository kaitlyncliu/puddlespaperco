import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './Store';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Auth0Provider
		domain="dev-qmtahjgk.us.auth0.com"
		clientId="Tu6Xif54ZvLYY3ji3TcnfiNmXmoPyzF0"
		redirectUri={window.location.origin}
		audience="https://puddlesbackendapi"
	>
		<StoreProvider>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</StoreProvider>
	</Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
