import { Button, Row, Col } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { UserAvatar } from "../../../../../shared/user-avatar.tsx";
import { UserProfileLink } from "../../../../../shared/user-profile-link.tsx";

type Sharer = {
  id: string;
  name: string;
  avatar?: string;
};

interface SharerInformationProps {
  sharer: Sharer;
  listingId: string;
  isOwner?: boolean;
  sharedTimeAgo?: string;
  className?: string;
  currentUserId?: string | null;
  isCreating?: boolean;
  isMobile?: boolean;
  onMessageSharer?: () => void;
}

export const SharerInformation: React.FC<SharerInformationProps> = ({
  sharer,
  isOwner = false,
  sharedTimeAgo = "2 days ago",
  className = "",
  currentUserId,
  isCreating = false,
  isMobile = false,
  onMessageSharer,
}) => {
  return (
    <Row align="middle" gutter={4} className={className}>
      <Col
        style={{
          minWidth: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <UserAvatar
          userId={sharer.id}
          userName={sharer.name}
          size={48}
          avatarUrl={sharer.avatar}
        />
      </Col>
      <Col flex="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2 className="truncate" style={{ marginBottom: 0 }}>
            <UserProfileLink userId={sharer.id} displayName={sharer.name} />
          </h2>
          <p className="truncate" style={{ marginTop: 2 }}>
            shared {sharedTimeAgo}
          </p>
        </div>
      </Col>
      <Col>
        {!isOwner && currentUserId && (
          <Button
            className="secondaryButton"
            type="default"
            icon={<MessageOutlined />}
            loading={isCreating}
            onClick={onMessageSharer}
          >
            {!isMobile && "Message Sharer"}
          </Button>
        )}
      </Col>
    </Row>
  );
};
