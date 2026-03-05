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

// Export all icons referenced across the UI codebase.
// Add new entries here when a UI component imports a new icon.
export const AppstoreAddOutlined = IconStub;
export const ArrowLeftOutlined = IconStub;
export const BarChartOutlined = IconStub;
export const BarsOutlined = IconStub;
export const CalendarOutlined = IconStub;
export const CaretDownOutlined = IconStub;
export const CaretUpOutlined = IconStub;
export const CheckCircleOutlined = IconStub;
export const CloseCircleOutlined = IconStub;
export const CloseOutlined = IconStub;
export const ContainerOutlined = IconStub;
export const DeleteOutlined = IconStub;
export const DownOutlined = IconStub;
export const EditOutlined = IconStub;
export const EllipsisOutlined = IconStub;
export const EnvironmentFilled = IconStub;
export const ExclamationCircleOutlined = IconStub;
export const EyeInvisibleOutlined = IconStub;
export const EyeOutlined = IconStub;
export const FacebookFilled = IconStub;
export const FilterOutlined = IconStub;
export const HeartOutlined = IconStub;
export const HomeOutlined = IconStub;
export const InfoCircleOutlined = IconStub;
export const LeftOutlined = IconStub;
export const LoadingOutlined = IconStub;
export const LockOutlined = IconStub;
export const LoginOutlined = IconStub;
export const LogoutOutlined = IconStub;
export const MailOutlined = IconStub;
export const MenuOutlined = IconStub;
export const MessageOutlined = IconStub;
export const PhoneOutlined = IconStub;
export const PlusOutlined = IconStub;
export const RightOutlined = IconStub;
export const SearchOutlined = IconStub;
export const SettingOutlined = IconStub;
export const ShoppingCartOutlined = IconStub;
export const SortAscendingOutlined = IconStub;
export const SortDescendingOutlined = IconStub;
export const SwapOutlined = IconStub;
export const SwapRightOutlined = IconStub;
export const TwitterSquareFilled = IconStub;
export const UnlockOutlined = IconStub;
export const UpOutlined = IconStub;
export const UploadOutlined = IconStub;
export const UserOutlined = IconStub;

export default IconStub;
