import { Routes, Route } from 'react-router-dom';
import ConversationsMain from './pages/conversations-main.tsx';
import Conversation from './pages/Conversation.tsx';

export default function MessagesRoutes() {
	return (
		<Routes>
			<Route path="" element={<ConversationsMain />} />
			<Route path="user/:userId" element={<ConversationsMain />} />
			<Route
				path="user/:userId/conversation/:conversationId"
				element={<Conversation />}
			/>
		</Routes>
	);
}
