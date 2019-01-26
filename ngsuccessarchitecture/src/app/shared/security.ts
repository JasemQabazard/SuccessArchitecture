export class User {
   _id?: string;
   username: string;
   password: string;
   email: string;
   firstname: string;
   lastname: string;
   countrycode: string;
   mobile: string;
   avatar?: string;
   birthdate?: Date;
   role?: string;
   lastsignondate?: Date;
}

export class Codes {
   countryCode: string;
}
