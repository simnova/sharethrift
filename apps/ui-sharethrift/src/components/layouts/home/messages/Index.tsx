import { Routes, Route } from 'react-router-dom';
import MessagesMain from './pages/Main.tsx';
import Conversation from './pages/Conversation.tsx';

export default function MessagesRoutes() {
	return (
		<Routes>
			<Route path="" element={<MessagesMain />} />
			<Route path="user/:userId" element={<MessagesMain />} />
			<Route
				path="user/:userId/conversation/:conversationId"
				element={<Conversation />}
			/>
		</Routes>
	);
}
