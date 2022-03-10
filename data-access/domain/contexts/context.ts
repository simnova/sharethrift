import { Passport } from "./iam/passport";
import { ExecutionContext } from "../shared/execution-context";

export interface DomainExecutionContext extends ExecutionContext {
  passport: Passport;
}