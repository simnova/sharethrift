import { type FC, type ReactNode, createContext, useContext } from "react";

const UserIdContext = createContext<string | undefined>(undefined);

export const useUserId = () => useContext(UserIdContext);

export const UserIdProvider: FC<{ userId: string; children: ReactNode }> = ({ userId, children }) => (
  <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
);
