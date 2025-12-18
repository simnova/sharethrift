import { Avatar as AntAvatar } from 'antd';
import { Link } from 'react-router-dom';
import { isValidUserId } from './utils/user-validation.ts';
import { ShareThriftLogo } from './sharethrift-logo.tsx';

/**
 * Props for UserAvatar component
 * @property userId - The unique identifier for the user (ObjectID)
 * @property userName - Display name for accessibility and fallback initial
 * @property size - Avatar size in pixels (default: 48)
 * @property avatarUrl - Optional URL to user's avatar image
 * @property className - Additional CSS classes
 * @property style - Inline styles
 * @property shape - Avatar shape ('circle' | 'square')
 */
interface UserAvatarProps {
	userId: string;
	userName: string;
	size?: number;
	avatarUrl?: string;
	className?: string;
	style?: React.CSSProperties;
	shape?: 'circle' | 'square';
}

/**
 * UserAvatar component displays a user's avatar that optionally links to their profile.
 * When a valid userId is provided, clicking the avatar navigates to the user's profile.
 * Falls back to a non-clickable avatar when userId is missing or invalid.
 * @param props - The component props
 * @returns JSX element containing the avatar, optionally wrapped in a link
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
	userId,
	userName,
	size = 48,
	avatarUrl,
	className = '',
	style = {},
	shape = 'circle',
}) => {
	// Determine if we have a valid userId for linking
	const isClickable = isValidUserId(userId);

	const avatarContent = avatarUrl ? (
		<AntAvatar
			size={size}
			src={avatarUrl}
			shape={shape}
			className={className}
			style={{ ...style, cursor: isClickable ? 'pointer' : 'default' }}
			alt={`${userName}'s avatar`}
		/>
	) : (
		<AntAvatar
			size={size}
			shape={shape}
			className={className}
			style={{
				backgroundColor: 'var(--color-foreground-2)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
				fontFamily: 'var(--Urbanist, Arial, sans-serif)',
				cursor: isClickable ? 'pointer' : 'default',
				...style,
			}}
			icon={<ShareThriftLogo size={24} />}
		>
			{userName?.trim() ? userName.charAt(0).toUpperCase() : '?'}
		</AntAvatar>
	);

	// If no valid userId, render avatar without link
	if (!isClickable) {
		return avatarContent;
	}

	return (
		<Link to={`/user/${userId}`} aria-label={`View ${userName}'s profile`}>
			{avatarContent}
		</Link>
	);
};
