const showTypeDefs = `#graphql
# Define the Show type
type Show {
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

# Define the input types for mutations
input CreateShowInput {
  movieId: ID!
  theaterId: ID!
  showStartTime: String!
  showEndTime: String!
  amount: Float!
  createdBy: ID

}

input UpdateShowInput {
  movieId: ID
  theaterId: ID
  showStartTime: String
  showEndTime: String
  amount: String
}

# Define the Query type to fetch data
type Query {
  show(id: ID!): Show
  shows(id: ID): [Show]
}

# Define the Mutation type to modify data
type Mutation {
  createShow(input: CreateShowInput!): Show
  updateShow(id: ID!, input: UpdateShowInput!): Show
  deleteShow(id: ID!): Show
}`;
export default showTypeDefs;
