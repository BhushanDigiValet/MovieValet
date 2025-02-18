const reservationTypeDefs = `#graphql 
    type Reservation {
  id: ID!
  userId: ID!
  showId: ID!
  transactionId: ID
  reservationTime: String!
  seats: [String]!
  qrTicket: String!
}


input ReservationInput {
  showId: ID!
  transactionId: ID
  seats: [String!]!
  qrTicket: String!
}

type Query {
  getReservation(id: ID!): Reservation
  getReservationsByUser(userId: ID!): [Reservation]
}

type Mutation {
  createReservation(input: ReservationInput!): Reservation
  cancelReservation(id: ID!): Boolean
}
`;
export default reservationTypeDefs;
