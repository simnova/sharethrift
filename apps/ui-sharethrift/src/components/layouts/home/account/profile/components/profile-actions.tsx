import React from 'react';
import { Button } from 'antd';
import { SettingOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface ProfileActionsProps {
    isOwnProfile: boolean;
    isBlocked: boolean;
    canBlockUser: boolean;
    onEditSettings: () => void;
    onBlockUser?: () => void;
    onUnblockUser?: () => void;
    variant: 'mobile' | 'desktop';
}

export const ProfileActions: React.FC<Readonly<ProfileActionsProps>> = ({
    isOwnProfile,
    isBlocked,
    canBlockUser,
    onEditSettings,
    onBlockUser,
    onUnblockUser,
    variant,
}) => {
    const wrapperClass = variant === 'mobile' ? 'profile-settings-mobile' : 'profile-settings-desktop';

    if (isOwnProfile) {
        return (
            <div className={wrapperClass}>
                <Button type="primary" icon={<SettingOutlined />} onClick={onEditSettings}>
                    Account Settings
                </Button>
            </div>
        );
    }

    if (!canBlockUser) return null;

    return (
        <div className={wrapperClass}>
            {isBlocked ? (
                <Button
                    type="default"
                    icon={<CheckCircleOutlined />}
                    onClick={onUnblockUser}
                    className="secondaryButton"
                    // style={{ opacity: 1, filter: 'none' }}
                >
                    Unblock User
                </Button>
            ) : (
                <Button danger 
                    type="primary"
                    icon={<StopOutlined />} 
                    onClick={onBlockUser}>
                    Block User
                </Button>
            )}
        </div>
    );
};
