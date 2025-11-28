import { Link } from 'react-router-dom';

export interface UserProfileLinkProps {
	userId: string;
	displayName: string;
	className?: string;
	style?: React.CSSProperties;
}

export const UserProfileLink: React.FC<UserProfileLinkProps> = ({
	userId,
	displayName,
	className = '',
	style = {},
}) => {
	// If no valid userId (empty or whitespace-only), render as plain text instead of a broken link
	const isValidUserId = !!userId && userId.trim() !== '';
	
	if (!isValidUserId) {
		return (
			<span className={className} style={style}>
				{displayName}
			</span>
		);
	}

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
