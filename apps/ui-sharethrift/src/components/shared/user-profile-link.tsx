import { Link } from 'react-router-dom';

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
 * @param props - The component props
 * @returns JSX element containing a navigation link
 */
export const UserProfileLink: React.FC<UserProfileLinkProps> = ({
	userId,
	displayName,
	className = '',
	style = {},
}) => {
	return (
		<Link 
			to={`/user/${userId}`} 
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
