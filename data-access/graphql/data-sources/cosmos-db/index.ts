import * as User from "../../../shared/data-sources/cosmos-db/models/User";
import Users from "./users";

export const CosmosDB = {
  users: new Users(User.UserModel.collection)
}