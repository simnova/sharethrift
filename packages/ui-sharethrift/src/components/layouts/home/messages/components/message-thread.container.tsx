import { useState, useRef, useEffect } from 'react';
//import { useQuery, useMutation } from '@apollo/client';
// import {
//   HomeMessageThreadContainerGetConversationMessages as GET_CONVERSATION_MESSAGES,
//   HomeMessageThreadContainerSendMessage as SEND_MESSAGE
// } from './message-thread.container.graphql';
import { MessageThread } from './message-thread';

interface MessageThreadContainerProps {
  conversationId: string;
}

export function MessageThreadContainer({ conversationId }: MessageThreadContainerProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // TODO: Get actual user ID from authentication context
  const currentUserId = 'user123'; // Placeholder

//   const { data, loading, error, refetch } = useQuery(GET_CONVERSATION_MESSAGES, {
//     variables: { conversationId, limit: 50, offset: 0 },
//     pollInterval: 5000,
//   });

//   const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
//     onCompleted: () => {
//       setMessageText('');
//       refetch();
//     },
//     onError: (error) => {
//       console.error('Error sending message:', error);
//     }
//   });

  // TODO: Replace 'any' with your actual Message type/interface
  const messages: any[] = [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //const handleSendMessage = async (e: React.FormEvent) => {
    //e.preventDefault();
    // if (!messageText.trim() || sendingMessage) return;
    // try {
    //   await sendMessage({
    //     variables: {
    //       input: {
    //         conversationId,
    //         content: messageText.trim(),
    //         authorId: currentUserId
    //       }
    //     }
    //   });
    // } catch (error) {
    //   console.error('Failed to send message:', error);
    // }
  //};

  const handleSendMessage = async () => {
    // Message sending logic will go here
  };

  return (
    <MessageThread
      conversationId={conversationId}
      messages={messages}
      loading={false}
      error={null}
      messageText={messageText}
      setMessageText={setMessageText}
      sendingMessage={false}
      handleSendMessage={handleSendMessage}
      messagesEndRef={messagesEndRef}
      currentUserId={currentUserId}
    />
  );
}
