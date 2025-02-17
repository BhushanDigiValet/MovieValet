const userDefs = `#graphql
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
  input UserFilterInput {
    role: UserRole
  }

  type Query {
    users(input: UserFilterInput): [User]
    user(id: ID!): User
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: UserRole!
}
type AuthPayload {
    token: String
    message: String
  }
type OutputRegister {
    username: String
    email: String
    role:String
    message: String
  }
input UpdateUserInput {
    username: String
    email: String
    role: UserRole
}
input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    register(input: RegisterInput!): OutputRegister
    login(input: LoginInput!): AuthPayload
    deleteUser(id: ID!, role: String!): OutputRegister
    updateUser(id: ID!, input: UpdateUserInput!): OutputRegister
  }
`;

export default userDefs;
