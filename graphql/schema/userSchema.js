module.exports = `

  type User {
    _id: ID!
    email: String!
    password: String!
    user_id: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  extend type Query {
    users:[User!]
  }

  extend type Mutation {
    createUser(user:UserInput): User
  }
`;
