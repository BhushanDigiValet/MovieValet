const showTypeDefs = `#graphql
# Define the Show type
type Show {
  id: ID!
  movieId: ID!
  theaterId: ID!
  showTime: String!
  createdBy: ID
  updatedBy: ID
  createdAT: String!
  updatedAt: String!
}

# Define the input types for mutations
input CreateShowInput {
  movieId: ID!
  theaterId: ID!
  showTime: String!
  createdBy: ID
  updatedBy: ID
}

input UpdateShowInput {
  movieId: ID!
  theaterId: ID!
  showTime: String!
  updatedBy: ID
}

# Define the Query type to fetch data
type Query {
  getShow(id: ID!): Show
  getShows: [Show]
}

# Define the Mutation type to modify data
type Mutation {
  createShow(input: CreateShowInput!): Show
  updateShow(id: ID!, input: UpdateShowInput!): Show
  deleteShow(id: ID!): Show
}`;