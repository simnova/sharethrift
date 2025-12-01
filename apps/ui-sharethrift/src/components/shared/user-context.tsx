import React, { createContext, useContext } from "react";

export const UserIdContext = createContext<string | undefined>(undefined);

export const useUserId = () => useContext(UserIdContext);

export const UserIdProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => (
  <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
);
