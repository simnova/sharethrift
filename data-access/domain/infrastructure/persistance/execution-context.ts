import { UserModel } from "../../../infrastructure/data-sources/cosmos-db/models/user";
import { UserDomainAdapter } from "./adapters/user-domain-adapter";
import { User as UserDO } from "../../contexts/user/user";
import { PassportImpl } from "../../contexts/iam/passport";
import { DomainExecutionContext } from "../../contexts/context";

export const SystemExecutionContext = async ():Promise<DomainExecutionContext> => {return { passport: await PassportImpl.forSystem()} };

export const ExecutionContext = async (userId:string): Promise<DomainExecutionContext> => { 
  const mongoUser = await UserModel.findById(userId).exec();
  const userAdapter = new UserDomainAdapter(mongoUser) 
  const domainUser = new UserDO(userAdapter);
  const passport = new PassportImpl(domainUser);
  const context:DomainExecutionContext = {
    passport: passport,
  }
  return context;
}