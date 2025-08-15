import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
const CREATE_CONVERSATION = gql `
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      twilioConversationSid
      listingId
      participants
      createdAt
      updatedAt
    }
  }
`;
export function MessageSharerButton({ listingId, sharerId, className = '' }) {
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    // TODO: Get actual user ID from authentication context
    const currentUserId = 'user123'; // Placeholder
    const [createConversation] = useMutation(CREATE_CONVERSATION, {
        onCompleted: (data) => {
            // Navigate to the messages page with the conversation
            navigate(`/messages/user/${currentUserId}`, {
                state: { selectedConversationId: data.createConversation.id }
            });
        },
        onError: (error) => {
            console.error('Error creating conversation:', error);
            setIsCreating(false);
        }
    });
    const handleMessageSharer = async () => {
        if (currentUserId === sharerId) {
            // Can't message yourself
            return;
        }
        setIsCreating(true);
        try {
            await createConversation({
                variables: {
                    input: {
                        listingId,
                        participantIds: [currentUserId, sharerId]
                    }
                }
            });
        }
        catch (error) {
            console.error('Failed to create conversation:', error);
            setIsCreating(false);
        }
    };
    // Don't show button if user is the listing owner
    if (currentUserId === sharerId) {
        return null;
    }
    return (_jsx("button", { onClick: handleMessageSharer, disabled: isCreating, className: `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`, children: isCreating ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Creating..."] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), "Message Sharer"] })) }));
}
//# sourceMappingURL=message-sharer-button.js.map