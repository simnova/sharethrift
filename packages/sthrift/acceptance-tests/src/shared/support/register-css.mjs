/**
 * Register CSS globals for DOM testing environment.
 * This sets up the global DOM environment (window, document, navigator)
 * before any test code runs, ensuring @testing-library/react can render components.
 *
 * Also registers an ESM loader hook to handle CSS/asset imports in Node.js.
 */

import { register } from 'node:module';
import { Window } from 'happy-dom';
import React from 'react';

const window = new Window();

// Expose minimal browser globals needed by @testing-library/react.
// antd and @ant-design/icons are stubbed via css-loader.mjs, so we don't
// need the full browser API surface (getComputedStyle, SVGElement, etc.).
globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;
globalThis.HTMLElement = window.HTMLElement;
globalThis.HTMLInputElement = window.HTMLInputElement;
globalThis.HTMLTextAreaElement = window.HTMLTextAreaElement;
globalThis.HTMLSelectElement = window.HTMLSelectElement;
globalThis.HTMLFormElement = window.HTMLFormElement;
globalThis.React = React; // Make React available for JSX compiled to createElement calls

// Register ESM loader hook to handle CSS and asset imports
register('./css-loader.mjs', import.meta.url);
