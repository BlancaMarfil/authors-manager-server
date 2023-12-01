module.exports = `

  type Catalogue {
    _id: ID!
    userId: String!
    authors: [String!]!
    bookEntries: [BookEntry]!
  }

  input AuthorToCatalogueInput {
    userId: String!
    authorName: String!
  }

  input BookToCatalogueInput {
    userId: String!
    bookId: String!
    dateRead: String!
  }

  input BookFromCatalogueInput {
    userId: String!
    bookId: String!
  }

  extend type Query {
    authorsByUserId(userId: String!): [String!]
    bookEntriesByUserId(userId: String!): [BookEntry]!
    catalogueByUserId(userId: String!): Catalogue
    lastBookReadByUserId(userId: String!): BookEntry
    findAuthorbyName(input: AuthorToCatalogueInput): Boolean
    bookReadByUser(input: BookFromCatalogueInput): BookEntry
  }

  extend type Mutation {
    addAuthorToUserCatalogue(input: AuthorToCatalogueInput): Catalogue
    addBookToUserCatalogue(input: BookToCatalogueInput): Catalogue
    removeAuthorFromUserCatalogue(input: AuthorToCatalogueInput): Catalogue
    removeBookFromUserCatalogue(input: BookFromCatalogueInput): Catalogue
  }
`;
