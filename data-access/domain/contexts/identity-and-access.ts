export type Passport = {
  userId: string;
  roles: string[];
}

export class IdentityAndAccess {
  jwt: string;

  constructor(jwt: string) {
    this.jwt = jwt;
  } 
  get passport(): Passport {
    return  {
      userId: "",
      roles: [""]
    }
  }
}