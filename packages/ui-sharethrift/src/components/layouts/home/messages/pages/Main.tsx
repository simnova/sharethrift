import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ConversationList } from '../components/conversation-list';
import { MessageThread } from '../components/message-thread';

export default function MessagesMain() {
  const location = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Check if we navigated here with a selected conversation from MessageSharerButton
  useEffect(() => {
    if (location.state?.selectedConversationId) {
      setSelectedConversationId(location.state.selectedConversationId);
    }
  }, [location.state]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Inbox</h1>
        </div>
        <ConversationList 
          onConversationSelect={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      </div>

      {/* Message Thread Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <MessageThread conversationId={selectedConversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
              <p className="text-gray-400">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
