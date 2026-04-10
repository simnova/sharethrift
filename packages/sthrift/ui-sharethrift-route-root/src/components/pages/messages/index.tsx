import { Routes, Route } from "react-router-dom";
import { ConversationsMain } from "./pages/conversations-main.tsx";
import { Conversation } from "./pages/conversation.tsx";

export const MessagesRoutes: React.FC = () => {
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
};
