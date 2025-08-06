import { Routes, Route } from "react-router-dom";
import MessagesMain from "./Main";
import Conversation from "./Conversation";

export default function MessagesRoutes() {
  return (
    <Routes>
      <Route path="user/:userId" element={<MessagesMain />} />
      <Route path="user/:userId/conversation/:conversationId" element={<Conversation />} />
    </Routes>
  );
}
