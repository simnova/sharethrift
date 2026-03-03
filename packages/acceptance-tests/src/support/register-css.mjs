/**
 * Registers the CSS stub loader hook AND sets up the headless DOM
 * before any modules are loaded.
 * Used via NODE_OPTIONS='--import ./src/support/register-css.mjs'
 */
import { register } from 'node:module';
import { Window } from 'happy-dom';
import React from 'react';

// Make React available globally for classic JSX transform.
// tsx (via cucumber-js --require-module) may use the classic transform
// for cross-package .tsx files, which emits React.createElement() calls.
globalThis.React = React;

// Set up DOM globals BEFORE any test modules load.
// This ensures @testing-library/react sees `document` at import time.
const win = new Window({ url: 'http://localhost:3000' });
globalThis.window = win;
globalThis.document = win.document;
globalThis.navigator = win.navigator;

globalThis.matchMedia = (query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: () => {},
	removeListener: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
	dispatchEvent: () => false,
});

globalThis.ResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};

globalThis.getComputedStyle = () => ({
	getPropertyValue: () => '',
});

register(new URL('./css-hooks.mjs', import.meta.url));
