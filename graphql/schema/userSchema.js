module.exports = `

  type User {
    _id: ID!
    userId: String!
    email: String!
  }

  type AuthUser {
    userId: String!
    email: String!
    token: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  extend type Query {
    users:[User!]
    userById(userId: String!): User
  }

  extend type Mutation {
    createUser(user: UserInput): AuthUser
    loginUser(credentials: UserInput): AuthUser
  }
`;
