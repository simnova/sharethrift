import { createContext, useContext } from "react";

export interface ApplicantIdContextValue {
  applicantId: string | null;
  setApplicantId: (id: string | null) => void;
}

export const ApplicantIdContext = createContext<ApplicantIdContextValue | undefined>(undefined);

export function useApplicantId() {
  const ctx = useContext(ApplicantIdContext);
  if (!ctx) throw new Error("useApplicantId must be used within an ApplicantIdProvider");
  return ctx;
}
