const theaterTypeDefs = `#graphql

    type Location {
    address: String!
    city: String!
    state: String!
    pinCode: String!
  }

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

  input LocationInput {
    address: String!
    city: String!
    state: String!
    pinCode: String!
  }

  input TheaterInput {
    name: String!
    location: LocationInput!
    adminId: ID!
  }
  input UpdateTheaterInput {
    name: String
    location: LocationInput
    adminId: ID
   

  }

  type Query {
    theaters: [Theater!]!
    theater(id: ID!): Theater!
  }

  type Mutation {
    createTheater(input: TheaterInput!): Theater!
    deleteTheater(id: ID!): Theater!
    updateTheater(id: ID!, input: UpdateTheaterInput!): Theater!
  }
`;

export default theaterTypeDefs;

// type Query {
//     getTheaters: [Theater!]!
//     getTheater(id: ID!): Theater
//   }

//   type Mutation {
//     createTheater(input: TheaterInput!): Theater!
//     updateTheater(id: ID!, input: TheaterInput!): Theater!
//     deleteTheater(id: ID!): Boolean!
//   }
