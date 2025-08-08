import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ConversationList } from '../components/conversation-list';
import { MessageThread } from '../components/message-thread';
import { Layout, Typography, Empty } from 'antd';

export default function MessagesMain() {
  const location = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.selectedConversationId) {
      setSelectedConversationId(location.state.selectedConversationId);
    }
  }, [location.state]);

  return (
    <Layout style={{ height: '100vh', background: '#f5f5f5' }}>
      <Layout.Sider width={340} style={{ background: '#fff', borderRight: '1px solid #f0f0f0', padding: 0 }}>
        <div style={{ padding: 24, borderBottom: '1px solid #f0f0f0' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>Inbox</Typography.Title>
        </div>
        <ConversationList 
          onConversationSelect={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      </Layout.Sider>
      <Layout.Content style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f5' }}>
        {selectedConversationId ? (
          <MessageThread conversationId={selectedConversationId} />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Empty
              description={
                <>
                  <Typography.Title level={5}>Select a conversation</Typography.Title>
                  <Typography.Text type="secondary">Choose a conversation to start messaging</Typography.Text>
                </>
              }
              style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}
            />
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
}
