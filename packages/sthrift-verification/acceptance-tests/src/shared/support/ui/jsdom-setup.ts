// Sets up a jsdom-based DOM environment for React component rendering in Node.js
// Must be called BEFORE any React component is imported
import { JSDOM } from 'jsdom';

let initialized = false;

export function ensureJsdom(): void {
	if (initialized) return;

	const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
		url: 'http://localhost:3000',
		pretendToBeVisual: true,
	});

	const { window } = dom;

	// Core DOM globals - use Object.defineProperty for read-only properties
	globalThis.window = window as unknown as Window & typeof globalThis;
	globalThis.document = window.document;
	Object.defineProperty(globalThis, 'navigator', {
		value: window.navigator,
		writable: true,
		configurable: true,
	});

	// DOM element constructors (needed by React + antd)
	globalThis.HTMLElement = window.HTMLElement;
	globalThis.HTMLInputElement = window.HTMLInputElement;
	globalThis.HTMLTextAreaElement = window.HTMLTextAreaElement;
	globalThis.HTMLSelectElement = window.HTMLSelectElement;
	globalThis.HTMLButtonElement = window.HTMLButtonElement;
	globalThis.HTMLFormElement = window.HTMLFormElement;
	globalThis.HTMLDivElement = window.HTMLDivElement;
	globalThis.HTMLSpanElement = window.HTMLSpanElement;
	globalThis.HTMLImageElement = window.HTMLImageElement;
	globalThis.HTMLAnchorElement = window.HTMLAnchorElement;
	globalThis.Element = window.Element;
	globalThis.Node = window.Node;
	globalThis.Text = window.Text;
	globalThis.DocumentFragment = window.DocumentFragment;
	globalThis.SVGElement = window.SVGElement;

	// Event constructors
	globalThis.Event = window.Event;
	globalThis.CustomEvent = window.CustomEvent;
	globalThis.MouseEvent = window.MouseEvent;
	globalThis.KeyboardEvent = window.KeyboardEvent;
	globalThis.FocusEvent = window.FocusEvent;
	globalThis.InputEvent = window.InputEvent;

	// Other APIs needed by antd and React
	globalThis.MutationObserver = window.MutationObserver;
	globalThis.getComputedStyle = window.getComputedStyle;
	globalThis.CSSStyleDeclaration = window.CSSStyleDeclaration;
	globalThis.DOMParser = window.DOMParser;
	globalThis.XMLSerializer = window.XMLSerializer;
	globalThis.Range = window.Range;
	globalThis.NodeList = window.NodeList;
	globalThis.HTMLCollection = window.HTMLCollection;

	// Mock matchMedia (required by antd responsive components)
	const matchMediaMock = () => ({
		matches: false,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
		media: '',
		onchange: null,
	});
	window.matchMedia = window.matchMedia || matchMediaMock;
	globalThis.matchMedia = window.matchMedia;

	// Mock ResizeObserver (required by antd)
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as unknown as typeof ResizeObserver;

	// Mock IntersectionObserver
	globalThis.IntersectionObserver = class IntersectionObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
		root = null;
		rootMargin = '';
		thresholds = [] as number[];
		takeRecords() { return []; }
	} as unknown as typeof IntersectionObserver;

	// Mock ShadowRoot (needed by antd icons / rc-util)
	if (!globalThis.ShadowRoot) {
		globalThis.ShadowRoot = class ShadowRoot {} as unknown as typeof ShadowRoot;
	}

	// Mock scroll and selection APIs
	window.scrollTo = () => {};
	globalThis.scrollTo = () => {};
	window.getSelection = () => null as unknown as Selection;

	// Mock requestAnimationFrame (not always present in jsdom)
	if (!globalThis.requestAnimationFrame) {
		globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
			return setTimeout(() => callback(Date.now()), 0) as unknown as number;
		};
		globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
	}

	// Mock import.meta.env for Vite-specific code paths
	if (!import.meta.env) {
		(import.meta as { env: Record<string, string> }).env = {};
	}

	// Suppress React error boundary warnings in console during acceptance tests
	// These are expected since antd components may partially fail to render in jsdom
	const originalConsoleError = console.error;
	console.error = (...args: unknown[]) => {
		const message = String(args[0] ?? '');
		if (
			message.includes('Consider adding an error boundary') ||
			message.includes('An error occurred in the <') ||
			message.includes('Error: Uncaught') ||
			message.includes('Warning: Can not find FormContext')
		) {
			return; // Suppress expected rendering warnings
		}
		originalConsoleError.apply(console, args);
	};

	initialized = true;
}

export function cleanupJsdom(): void {
	if (!initialized) return;
	// Clean up body for next test
	while (document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	}
	const root = document.createElement('div');
	root.id = 'root';
	document.body.appendChild(root);
}
