/**
 * Lightweight antd stubs for headless DOM tests.
 *
 * These render real HTML elements so @testing-library queries
 * (getByPlaceholderText, getByRole) and userEvent interactions work.
 *
 * antd is an implementation detail of the UI components — acceptance tests
 * care about the user interaction flow, not antd's internal rendering.
 */
import React from 'react';

const h = React.createElement;

// --- Form ---

function FormItem({ children, label, name }) {
	return h('div', { 'data-field': name },
		label ? h('label', { htmlFor: name }, label) : null,
		children,
	);
}

function FormComponent({ children, ...props }) {
	return h('form', props, children);
}
FormComponent.Item = FormItem;
FormComponent.useForm = () => [{}];

export const Form = FormComponent;

// --- Input ---

export const Input = React.forwardRef(function Input(props, ref) {
	return h('input', { type: 'text', ...props, ref });
});

// --- Select ---

function OptionComponent({ children, value }) {
	return h('option', { value }, children);
}

function SelectComponent({ children, placeholder, value, onChange, ...props }) {
	return h('select', {
		value: value || '',
		onChange: onChange ? (e) => onChange(e.target.value) : undefined,
		...props,
	},
		placeholder ? h('option', { value: '', disabled: true }, placeholder) : null,
		children,
	);
}
SelectComponent.Option = OptionComponent;

export const Select = SelectComponent;

// --- DatePicker ---

function DatePickerComponent(props) {
	return h('input', { type: 'date', ...props });
}

function RangePickerComponent({ placeholder, style }) {
	return h('div', { style },
		h('input', { type: 'date', placeholder: placeholder?.[0] || 'Start date' }),
		h('input', { type: 'date', placeholder: placeholder?.[1] || 'End date' }),
	);
}
DatePickerComponent.RangePicker = RangePickerComponent;

export const DatePicker = DatePickerComponent;

// --- Button ---

export function Button({ children, onClick, disabled, loading, ...props }) {
	return h('button', {
		onClick,
		disabled: disabled || loading,
		...props,
	}, children);
}

export default { Form, Input, Select, DatePicker, Button };
