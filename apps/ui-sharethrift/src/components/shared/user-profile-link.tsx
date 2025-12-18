import { Link } from 'react-router-dom';
import { isValidUserId } from './utils/user-validation.ts';
import { getUserProfilePath } from './utils/user-routes.ts';

/**
 * Props for UserProfileLink component
 * @property userId - The unique identifier for the user (ObjectID)
 * @property displayName - The text to display as the clickable link
 * @property className - Additional CSS classes
 * @property style - Custom inline styles
 */
interface UserProfileLinkProps {
	userId: string;
	displayName: string;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * UserProfileLink component renders a clickable link to a user's profile.
 * When a valid userId is provided, renders a navigation link.
 * Falls back to plain text when userId is missing or invalid.
 * @param props - The component props
 * @returns JSX element containing either a link or plain text
 */
export const UserProfileLink: React.FC<UserProfileLinkProps> = ({
	userId,
	displayName,
	className = '',
	style = {},
}) => {
	// If no valid userId, render as plain text instead of a broken link
	if (!isValidUserId(userId)) {
		return (
			<span className={className} style={style}>
				{displayName}
			</span>
		);
	}

	return (
		<Link 
			to={getUserProfilePath(userId)} 
			className={className}
			style={{ 
				textDecoration: 'none',
				color: 'inherit',
				...style,
			}}
		>
			{displayName}
		</Link>
	);
};
