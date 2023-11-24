const Catalogue = require("../../models/catalogue");
const BookEntry = require("../../models/bookEntry");

module.exports = {
  authorsByUserId: async (args) => {
    const { userId } = args;
    try {
      const userFound = await Catalogue.findOne({ userId: userId });
      return userFound.authors;
    } catch (error) {
      throw error;
    }
  },

  bookEntriesByUserId: async (args) => {
    const { userId } = args;
    try {
      const userFound = await Catalogue.findOne({ userId: userId });
      const bookEntries = await BookEntry.find({
        bookEntryId: { $in: userFound.bookEntries },
      });

      return bookEntries;
    } catch (error) {
      throw error;
    }
  },

  addAuthorToUserCatalogue: async (args) => {
    try {
      const { userId, authorId } = args.input;

      const updatedCatalogue = await Catalogue.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { authors: authorId } }, // $addToSet ensures unique values in the array
        { new: true, upsert: true } // Return the updated document and create if not found
      );

      return updatedCatalogue._doc;
    } catch (error) {
      throw error;
    }
  },

  addBookToUserCatalogue: async (args) => {
    try {
      const { userId, bookId, dateRead } = args.input;

      const updatedBookEntry = await BookEntry.findOneAndUpdate(
        { bookId: bookId },
        { $set: { bookId: bookId, dateRead: dateRead } },
        { new: true, upsert: true } // Return the updated document and create if not found
      );

      const updatedCatalogue = await Catalogue.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { bookEntries: updatedBookEntry.bookEntryId } }, // $addToSet ensures unique values in the array
        { new: true, upsert: true } // Return the updated document and create if not found
      );

      const bookEntries = await BookEntry.find({
        bookEntryId: { $in: updatedCatalogue.bookEntries },
      });

      return {
        userId: updatedCatalogue.userId,
        authors: updatedCatalogue.authors,
        bookEntries: bookEntries,
      };
    } catch (error) {
      throw error;
    }
  },
};
