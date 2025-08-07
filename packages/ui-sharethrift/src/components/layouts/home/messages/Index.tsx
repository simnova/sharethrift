import { Routes, Route } from "react-router-dom";
import MessagesMain from "./pages/Main";
import Conversation from "./pages/Conversation";

export default function MessagesRoutes() {
  return (
    <Routes>
      <Route path="user/:userId" element={<MessagesMain />} />
      <Route path="user/:userId/conversation/:conversationId" element={<Conversation />} />
    </Routes>
  );
}
