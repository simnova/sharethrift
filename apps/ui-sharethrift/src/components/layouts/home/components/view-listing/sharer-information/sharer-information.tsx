import { Button, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  CreateConversationDocument,
  HomeConversationListContainerConversationsByUserDocument,
} from "../../../../../../generated.tsx";
import type {
  CreateConversationMutation,
  CreateConversationMutationVariables,
} from "../../../../../../generated.tsx";
import { UserAvatar } from "../../../../../shared/user-avatar.tsx";
import { UserProfileLink } from "../../../../../shared/user-profile-link.tsx";

export type Sharer = {
  id: string;
  name: string;
  avatar?: string;
};

export interface SharerInformationProps {
  sharer: Sharer;
  listingId: string;
  isOwner?: boolean;
  sharedTimeAgo?: string;
  className?: string;
  currentUserId?: string | null;
}

export const SharerInformation: React.FC<SharerInformationProps> = ({
  sharer,
  listingId,
  isOwner = false,
  sharedTimeAgo = "2 days ago",
  className = "",
  currentUserId,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const [createConversation, { loading: isCreating }] = useMutation<
    CreateConversationMutation,
    CreateConversationMutationVariables
  >(CreateConversationDocument, {
    refetchQueries: [
      {
        query: HomeConversationListContainerConversationsByUserDocument,
        variables: { userId: currentUserId },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data.createConversation.status.success) {
        navigate("/messages", {
          state: {
            selectedConversationId: data.createConversation.conversation?.id,
          },
          replace: false,
        });
      } else {
        console.log(
          "Failed to create conversation:",
          data.createConversation.status.errorMessage
        );
      }
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
    },
  });

  const handleMessageSharer = async () => {
    if (!currentUserId) {
      return;
    }

    try {
      await createConversation({
        variables: {
          input: {
            listingId,
            sharerId: sharer.id,
            reserverId: currentUserId,
          },
        },
      });
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
            onClick={handleMessageSharer}
          >
            {!isMobile && "Message Sharer"}
          </Button>
        )}
      </Col>
    </Row>
  );
};
