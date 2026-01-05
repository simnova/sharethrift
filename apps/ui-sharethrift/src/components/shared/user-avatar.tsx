import { useContext, useState } from 'react';
import { Avatar as AntAvatar } from 'antd';
import { Link } from 'react-router-dom';
import { AuthContext } from 'react-oidc-context';
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
 * UserAvatar component displays a user's avatar that links to their profile.
 * Clicking the avatar navigates to the user's profile page.
 * @param props - The component props
 * @returns JSX element containing the avatar wrapped in a link
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
	const auth = useContext(AuthContext);
	const isAuthenticated = auth?.isAuthenticated ?? false;
	const profilePath = userId ? (isAuthenticated ? `/user/${userId}` : '/login') : undefined;

	// Track if the avatar image failed to load
	const [imageError, setImageError] = useState(false);
	const showImageAvatar = !!avatarUrl && !imageError;

	const avatarContent = showImageAvatar ? (
		<AntAvatar
			size={size}
			src={avatarUrl}
			shape={shape}
			className={className}
			style={{ ...style, cursor: 'pointer' }}
			alt={`${userName}'s avatar`}
			onError={() => {
				// If the image fails to load, fall back to the logo/initials variant
				setImageError(true);
				return false;
			}}
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
				cursor: 'pointer',
				...style,
			}}
			icon={<ShareThriftLogo size={24} />}
		>
			{userName?.trim() ? userName.charAt(0).toUpperCase() : '?'}
		</AntAvatar>
	);

	if (!profilePath) {
		return avatarContent;
	}

	return (
		<Link to={profilePath} aria-label={`View ${userName}'s profile`}>
			{avatarContent}
		</Link>
	);
};
