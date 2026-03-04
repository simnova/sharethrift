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

const InputComponent = React.forwardRef(function Input(props, ref) {
	return h('input', { type: 'text', ...props, ref });
});

function TextAreaComponent(props) {
	return h('textarea', props);
}

InputComponent.TextArea = TextAreaComponent;

export const Input = InputComponent;

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

// --- Layout ---

function LayoutComponent({ children }) {
	return h('div', { className: 'ant-layout' }, children);
}

function HeaderComponent({ children }) {
	return h('header', { className: 'ant-layout-header' }, children);
}

function FooterComponent({ children }) {
	return h('footer', { className: 'ant-layout-footer' }, children);
}

LayoutComponent.Header = HeaderComponent;
LayoutComponent.Footer = FooterComponent;

export const Layout = LayoutComponent;

// --- Menu ---

function MenuItemComponent({ children, key }) {
	return h('li', { 'data-key': key }, children);
}

function MenuComponent({ children, items, ...props }) {
	return h('ul', { className: 'ant-menu', ...props },
		items ? items.map((item) => h(MenuItemComponent, { key: item.key }, item.label)) : children,
	);
}
MenuComponent.Item = MenuItemComponent;

export const Menu = MenuComponent;

// --- Dropdown ---

export function Dropdown({ children, menu, trigger }) {
	return h('div', { className: 'ant-dropdown', 'data-trigger': trigger }, children);
}

// --- Drawer ---

export function Drawer({ children, open, onClose, title, ...props }) {
	if (!open) return null;
	return h('div', { className: 'ant-drawer', ...props },
		h('div', { className: 'ant-drawer-header' }, title),
		h('div', { className: 'ant-drawer-body' }, children),
		h('button', { className: 'ant-drawer-close', onClick: onClose }, '×'),
	);
}

// --- Card ---

function CardMetaComponent({ title, description }) {
	return h('div', { className: 'ant-card-meta' },
		title ? h('div', { className: 'ant-card-meta-title' }, title) : null,
		description ? h('div', { className: 'ant-card-meta-description' }, description) : null,
	);
}

function CardComponent({ children, title, hoverable, ...props }) {
	return h('div', { className: 'ant-card', 'data-hoverable': hoverable ? 'true' : undefined, ...props },
		title ? h('div', { className: 'ant-card-head' }, h('div', { className: 'ant-card-head-title' }, title)) : null,
		h('div', { className: 'ant-card-body' }, children),
	);
}
CardComponent.Meta = CardMetaComponent;

export const Card = CardComponent;

// --- Empty ---

export function Empty({ description, ...props }) {
	return h('div', { className: 'ant-empty', ...props },
		h('div', { className: 'ant-empty-description' }, description || 'No Data'),
	);
}

// --- Pagination ---

export function Pagination({ current, total, pageSize, onChange, ...props }) {
	return h('div', { className: 'ant-pagination', ...props },
		h('button', {
			onClick: () => onChange?.(current - 1),
			disabled: current <= 1,
		}, 'Prev'),
		h('span', { className: 'ant-pagination-item-active' }, `${current} / ${Math.ceil(total / (pageSize || 10))}`),
		h('button', {
			onClick: () => onChange?.(current + 1),
			disabled: current >= Math.ceil(total / (pageSize || 10)),
		}, 'Next'),
	);
}

// --- Skeleton ---

export function Skeleton({ active, paragraph, title, ...props }) {
	return h('div', { className: 'ant-skeleton', 'data-active': active ? 'true' : undefined, ...props },
		title ? h('div', { className: 'ant-skeleton-title' }) : null,
		paragraph ? h('div', { className: 'ant-skeleton-paragraph' }) : null,
	);
}

// --- Result ---

export function Result({ status, title, subTitle, extra, ...props }) {
	return h('div', { className: `ant-result ant-result-${status}`, ...props },
		h('div', { className: 'ant-result-icon' }, status),
		title ? h('div', { className: 'ant-result-title' }, title) : null,
		subTitle ? h('div', { className: 'ant-result-subtitle' }, subTitle) : null,
		extra ? h('div', { className: 'ant-result-extra' }, extra) : null,
	);
}

// --- message ---

export const message = {
	success: (content) => console.log('message.success:', content),
	error: (content) => console.log('message.error:', content),
	warning: (content) => console.log('message.warning:', content),
	info: (content) => console.log('message.info:', content),
	loading: (content) => console.log('message.loading:', content),
};

// --- Table ---

function TableColumnComponent(props) {
	return h('col', props);
}

export function Table({ columns, dataSource, ...props }) {
	return h('table', { className: 'ant-table', ...props },
		columns ? h('thead', {}, columns.map((col) => h('th', { key: col.key || col.dataIndex }, col.title))) : null,
		dataSource ? h('tbody', {}, dataSource.map((row, idx) => h('tr', { key: row.key || idx }, columns?.map((col) => h('td', { key: col.key || col.dataIndex }, row[col.dataIndex]))))) : null,
	);
}
Table.Column = TableColumnComponent;

// --- Typography ---

function TitleComponent({ level, children, ...props }) {
	const tag = `h${level || 1}`;
	return h(tag, { className: 'ant-typography-title', ...props }, children);
}

function TextComponent({ children, ...props }) {
	return h('span', { className: 'ant-typography-text', ...props }, children);
}

function ParagraphComponent({ children, ...props }) {
	return h('p', { className: 'ant-typography-paragraph', ...props }, children);
}

export const Typography = {
	Title: TitleComponent,
	Text: TextComponent,
	Paragraph: ParagraphComponent,
};

// --- ConfigProvider ---

export function ConfigProvider({ children, ...props }) {
	return h('div', { className: 'ant-config-provider', ...props }, children);
}

// --- Tag ---

export function Tag({ children, color, ...props }) {
	return h('span', { className: 'ant-tag', 'data-color': color, ...props }, children);
}

export default { Form, Input, Select, DatePicker, Button, Layout, Menu, Dropdown, Drawer, Card, Empty, Pagination, Skeleton, Result, message, Table, Typography, ConfigProvider, Tag };
