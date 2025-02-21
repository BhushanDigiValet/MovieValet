export interface ILocation {
  city: string;
  state: string;
  country: string;
}

export interface CreateTheaterInput {
  name: string;
  location: ILocation;
  adminId: string;
}
