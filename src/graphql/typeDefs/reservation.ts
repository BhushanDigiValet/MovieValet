const reservationTypeDefs = `#graphql 

  type Theater {
    id: ID!
    name: String!
    location: Location!
    adminId: User!
    isDeleted: Boolean!
    createdBy: User
    updatedBy: User
    createdAt: String!
    updatedAt: String!
  }
  type Movie {
  id: ID!
  title: String!
  description: String
  genre:  Genre
  imdbRating: Float
  language: [String!]!
  posterUrl: String!
  starCast: [StarCast!]!
  durationMinutes: Int
  releaseDate: String
  isDeleted: Boolean!
  createdBy: User
  updatedBy: User
  createdAt: String!
  updatedAt: String!
}
   type showId {
     id: ID!
  movieId: Movie!
  theaterId: Theater!
  showStartTime: String!
  showEndTime: String!
  createdBy: User
  updatedBy: User
  createdAT: String!
  updatedAt: String!
  isDeleted: Boolean!
  amount: Float!
   }
    type Reservation {
  id: ID!
  userId: ID!
  showId: showId!
  transactionId: ID
  reservationTime: String!
  seatNumber: String!
  qrTicket: String!
  isDeleted: Boolean!
}



input ReservationInput {
  showId: ID!
  transactionId: ID
  seatNumber: String!
}

type Query {
  getReservations(theaterId: ID, showId: ID): [Reservation]
  getReservationsByUser(userId: ID!): [Reservation]
}

type Mutation {
  createReservation(input: ReservationInput!): Reservation
  cancelReservation(id: ID!): Reservation!
}
`;
export default reservationTypeDefs;
