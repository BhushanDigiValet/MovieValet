const typeDefs = `#graphql
  enum UserRole {
    ADMIN
    THEATER_ADMIN
    CUSTOMER
  }
  
  type User{
    id:ID!
    username: String!
    email: String!
    role: UserRole!
    isDefault: Boolean!
    createdBy: ID
    updatedBy: ID
    createdAt: String!
    updatedAt: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }
  input CreateCustomerInput {
    username: String!
    email: String!
    password: String!
    role: UserRole!
}
input UpdateUserInput {
    username: String
    email: String
    role: UserRole
}
type Mutation {
    register(input: CreateCustomerInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): User
  }
`;

export default typeDefs;
