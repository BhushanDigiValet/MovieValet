export enum UserRole {
  ADMIN = "ADMIN",
  THEATER_ADMIN = "THEATER_ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum Genre {
  ACTION = "ACTION",
  COMEDY = "COMEDY",
  DRAMA = "DRAMA",
  HORROR = "HORROR",
  ROMANCE = "ROMANCE",
  SCI_FI = "SCI_FI",
  THRILLER = "THRILLER",
  ANIMATION = "ANIMATION",
  DOCUMENTARY = "DOCUMENTARY",
  FANTASY = "FANTASY",
  MYSTERY = "MYSTERY",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IUserCredential {
  cardNumber: number;
  pin: number;
  cvv: number;
}

export interface ILocation {
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface IStarCast {
  name: string;
  image: string;
}
