import { Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Link: AntLink } = Typography;

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
	return (
		<Link to={`/user/${userId}`} style={{ textDecoration: 'none' }}>
			<AntLink className={className} style={{ ...style }}>
				{displayName}
			</AntLink>
		</Link>
	);
};
