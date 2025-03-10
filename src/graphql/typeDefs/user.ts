const userDefs = `#graphql
  enum UserRole {
    ADMIN
    THEATER_ADMIN
    CUSTOMER
  }
  type city{
    _id:ID
    name:String!
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
    cityId: city
  }
  input UserFilterInput {
    role: UserRole
    limit: Int
    offset: Int
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: UserRole!
    cityName: String
}

  type AuthPayload {
    token: String
    role: UserRole
  }
  
  type OutputRegister {
    username: String
    email: String
    role:UserRole
    city: ID
    message: String
  }
  
  input UpdateUserInput {
    username: String
    email: String
    role: UserRole
    cityName: String
    isDeleted: Boolean
}

input LoginInput {
    email: String!
    password: String!
  }
  
  type Query {
    users(input: UserFilterInput): [User]
    user(id: ID!): User
  }

  type Mutation {
    register(input: RegisterInput!): User
    login(input: LoginInput!): AuthPayload
    deleteUser(id: ID!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
  }
`;

export default userDefs;
