module.exports = `

  type User {
    _id: ID!
    userId: String!
    email: String!
    password: String!
  }

  type RegistrationUser {
    userId: String!
    email: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  extend type Query {
    users:[User!]
  }

  extend type Mutation {
    createUser(user:UserInput): RegistrationUser
  }
`;
