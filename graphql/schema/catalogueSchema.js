module.exports = `

  type Catalogue {
    _id: ID!
    userId: String!
    authors: [String!]!
    bookEntries: [BookEntry]!
  }

  input AuthorToCatalogueInput {
    userId: String!
    authorId: String!
  }

  input BookToCatalogueInput {
    userId: String!
    bookId: String!
    dateRead: String!
  }

  extend type Query {
    authorsByUserId(userId: String!): [String!]
    bookEntriesByUserId(userId: String!): [BookEntry]!
  }

  extend type Mutation {
    addAuthorToUserCatalogue(input: AuthorToCatalogueInput): Catalogue
    addBookToUserCatalogue(input: BookToCatalogueInput): Catalogue
  }
`;