import {
	Card,
	Avatar,
	Button,
	Tag,
	Typography,
	Row,
	Col,
	Space,
	Divider,
} from 'antd';
import { ListingsGrid } from '@sthrift/ui-components';
import { UserOutlined } from '@ant-design/icons';
import '../components/profile-view.overrides.css';
import type { ItemListing } from '../../../../../../generated';
import type { ProfileUser } from './profile-view.types';
import { ProfileActions } from './profile-actions.tsx';

const { Text } = Typography;

// ...interfaces now imported from profile-view.types.ts

interface ProfileViewProps {
    user: ProfileUser;
    listings: ItemListing[];
    isOwnProfile: boolean;
    isBlocked?: boolean;
    isAdmin?: boolean;
    canBlockUser?: boolean;
    onEditSettings: () => void;
    onListingClick: (listingId: string) => void;
    onBlockUser?: () => void;
    onUnblockUser?: () => void;
    adminControls?: React.ReactNode;
}

export const ProfileView: React.FC<Readonly<ProfileViewProps>> = ({
    user,
    listings,
    isOwnProfile,
    isBlocked = false,
    isAdmin = false,
    canBlockUser = false,
    onEditSettings,
    onListingClick,
    onBlockUser,
    onUnblockUser,
    adminControls,
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">


            {/* Profile Header */}
            <Card
                className="mb-6 profile-header"
                style={{
                    opacity: isBlocked && isAdmin ? 0.7 : 1,
                    filter: isBlocked && isAdmin ? 'grayscale(50%)' : 'none',
                }}
            >
                {/* Mobile actions */}
                <ProfileActions
                    variant="mobile"
                    isOwnProfile={isOwnProfile}
                    isBlocked={isBlocked}
                    canBlockUser={canBlockUser}
                    onEditSettings={onEditSettings}
                    onBlockUser={onBlockUser}
                    onUnblockUser={onUnblockUser}
                />
                <Row gutter={24} align="middle">
                    <Col xs={24} sm={6} lg={4} className="text-center mb-4 sm:mb-0">
                        <Avatar className="mb-4 profile-avatar-scale" />
                    </Col>
                    <Col xs={24} sm={18} lg={20}>
                        <div className="nameSect profile-info-center">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '1rem',
                                }}
                            >
                                <div className="title42">
                                    {user.firstName}{' '}
                                    {user.lastName?.charAt(0)}.
                                </div>
                                {/* Desktop actions */}
                                <ProfileActions
                                    variant="desktop"
                                    isOwnProfile={isOwnProfile}
                                    isBlocked={isBlocked}
                                    canBlockUser={canBlockUser}
                                    onEditSettings={onEditSettings}
                                    onBlockUser={onBlockUser}
                                    onUnblockUser={onUnblockUser}
                                />
                            </div>
                            <h3 className="block mb-2">@{user.username}</h3>
                        </div>
                        <div className="profile-info-center">
                            <Space className="mb-3" wrap>
                                <Tag className="personalAccount">
                                    <UserOutlined
                                        style={{ color: 'var(--color-background)', fontSize: 16 }}
                                    />
                                    {user.accountType
                                        ? user.accountType.charAt(0).toUpperCase() +
                                        user.accountType?.slice(1)
                                        : ''}
                                </Tag>
                                <span>|</span>
                                <p>
                                    {user.location?.city},{' '}
                                    {user.location?.state}
                                </p>
                                <span>|</span>
                                <p>Sharing since {formatDate(user.createdAt)}</p>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Divider orientation="left">
                <h2 className="title30" style={{ color: 'var(--color-tertiary)' }}>
                    My Listings
                </h2>
            </Divider>

            {/* User Listings */}
            <div
                className="profile-listings-grid-override"
                style={{
                    marginTop: '1rem',
                    marginBottom: '2rem',
                    marginLeft: '3rem',
                    marginRight: '3rem',
                }}
            >
                <ListingsGrid
                    listings={listings.map((l) => ({
                        ...l,
                        id: l.id,
                        sharingPeriodStart: new Date(l.sharingPeriodStart),
                        sharingPeriodEnd: new Date(l.sharingPeriodEnd),
                        state: [
                            'Published',
                            'Paused',
                            'Cancelled',
                            'Drafted',
                            'Expired',
                            'Blocked',
                            'Appeal Requested',
                        ].includes(l.state ?? '')
                            ? (l.state as
                                | 'Published'
                                | 'Paused'
                                | 'Cancelled'
                                | 'Drafted'
                                | 'Expired'
                                | 'Blocked'
                                | 'Appeal Requested'
                                | undefined)
                            : undefined,
                        createdAt: l.createdAt ? new Date(l.createdAt) : undefined,
                        sharingHistory: [], // Placeholder
                        reports: 0, // Placeholder
                        images: l.images ? [...l.images] : [], // Placeholder
                    }))}
                    onListingClick={(listing) => onListingClick(listing.id)}
                    currentPage={1}
                    pageSize={20}
                    total={listings.length}
                    onPageChange={() => {
                        console.log('Page change');
                    }}
                    showPagination={false}
                />
                {listings.length === 0 && (
                    <Card>
                        <div className="text-center py-8">
                            <Text type="secondary">No listings yet</Text>
                            {isOwnProfile && (
                                <div className="mt-4">
                                    <Button type="primary">Create Your First Listing</Button>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* Admin controls slot (modals etc.) */}
            {adminControls}
        </div>
    );
};
