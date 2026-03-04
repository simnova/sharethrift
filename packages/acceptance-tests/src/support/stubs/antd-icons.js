/**
 * Stubs for @ant-design/icons
 *
 * Returns empty span components for all icon exports.
 * This prevents import errors for icon names that don't exist or are deprecated in the installed version.
 */
import React from 'react';

const h = React.createElement;

// Icon stub that renders an empty span
function IconStub() {
	return h('span', { 'data-icon': 'stub', style: { display: 'inline-block' } });
}

// Export each explicitly referenced icon to avoid any import errors
export const FacebookFilled = IconStub;
export const TwitterSquareFilled = IconStub;
export const DownOutlined = IconStub;
export const LeftOutlined = IconStub;
export const HeartOutlined = IconStub;
export const ShoppingCartOutlined = IconStub;
export const HomeOutlined = IconStub;
export const MenuOutlined = IconStub;
export const CloseOutlined = IconStub;
export const SearchOutlined = IconStub;
export const UserOutlined = IconStub;
export const LogoutOutlined = IconStub;
export const LoginOutlined = IconStub;
export const CheckCircleOutlined = IconStub;
export const ExclamationCircleOutlined = IconStub;
export const InfoCircleOutlined = IconStub;
export const CloseCircleOutlined = IconStub;
export const CalendarOutlined = IconStub;
export const RightOutlined = IconStub;
export const UpOutlined = IconStub;
export const BarsOutlined = IconStub;
export const MailOutlined = IconStub;
export const PhoneOutlined = IconStub;
export const LockOutlined = IconStub;
export const UnlockOutlined = IconStub;
export const EyeOutlined = IconStub;
export const EyeInvisibleOutlined = IconStub;
export const CaretDownOutlined = IconStub;
export const CaretUpOutlined = IconStub;
export const EditOutlined = IconStub;
export const DeleteOutlined = IconStub;
export const SettingOutlined = IconStub;
export const FilterOutlined = IconStub;
export const SortAscendingOutlined = IconStub;
export const SortDescendingOutlined = IconStub;
export const ContainerOutlined = IconStub;
export const MessageOutlined = IconStub;
export const SwapRightOutlined = IconStub;

export default IconStub;
