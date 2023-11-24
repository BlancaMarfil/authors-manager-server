module.exports = `

  type BookEntry {
    _id: ID!
    bookEntryId: String!
    bookId: String!
    dateRead: String!
  }

  input BookEntryInput {
    bookId: String!
    dateRead: String!
  }

  extend type Query {
    bookEntryById(bookEntryId: String!): BookEntry!
  }

  extend type Mutation {
    createBookEntry(input: BookEntryInput): BookEntry
  }
`;
