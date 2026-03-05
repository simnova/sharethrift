/**
 * Stub for react-router-dom - provides minimal Router context for DOM tests
 * without requiring the full react-router-dom dependency in acceptance tests
 */
import React from 'react';

const RouterContext = React.createContext();

export function BrowserRouter({ children }) {
	return React.createElement(
		RouterContext.Provider,
		{ value: {} },
		children,
	);
}

export function useNavigate() {
	// Return a no-op navigate function for tests
	return (path) => {
		console.log('[Router Stub] Navigate to:', path);
	};
}

export function useParams() {
	return {};
}

export function useLocation() {
	return {
		pathname: '/',
		search: '',
		hash: '',
		state: null,
		key: 'default',
	};
}

export function useMatch(pattern) {
	return null;
}

export function useSearchParams() {
	return [new URLSearchParams(), () => {}];
}

export function Link({ to, children, ...props }) {
	return React.createElement('a', { href: to, ...props }, children);
}

export function NavLink({ to, children, ...props }) {
	return React.createElement('a', { href: to, ...props }, children);
}

export function Route(props) {
	return null;
}

export function Routes({ children }) {
	return React.createElement(React.Fragment, {}, children);
}

export default {
	BrowserRouter,
	useNavigate,
	useParams,
	useLocation,
	useMatch,
	useSearchParams,
	Link,
	NavLink,
	Route,
	Routes,
};
