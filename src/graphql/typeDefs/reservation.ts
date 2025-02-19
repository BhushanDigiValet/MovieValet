const reservationTypeDefs = `#graphql 
    type Reservation {
  id: ID!
  userId: ID!
  showId: ID!
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
  getReservations(theaterId: ID): [Reservation]
  getReservationsByUser(userId: ID!): [Reservation]
}

type Mutation {
  createReservation(input: ReservationInput!): Reservation
  cancelReservation(id: ID!): Boolean
}
`;
export default reservationTypeDefs;
