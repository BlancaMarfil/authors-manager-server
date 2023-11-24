const Catalogue = require("../../models/catalogue");
const BookEntry = require("../../models/bookEntry");

const getCatalogue = async (catalogue) => {
  const bookEntries = await BookEntry.find({
    bookEntryId: { $in: catalogue.bookEntries },
  });

  return {
    userId: catalogue.userId,
    authors: catalogue.authors,
    bookEntries: bookEntries,
  };
};

module.exports = {
  authorsByUserId: async (args) => {
    const { userId } = args;
    try {
      const catalogue = await Catalogue.findOne({ userId: userId });
      return catalogue.authors;
    } catch (error) {
      throw error;
    }
  },

  bookEntriesByUserId: async (args) => {
    const { userId } = args;
    try {
      const catalogue = await Catalogue.findOne({ userId: userId });
      const bookEntries = await BookEntry.find({
        bookEntryId: { $in: catalogue.bookEntries },
      });

      return bookEntries;
    } catch (error) {
      throw error;
    }
  },

  // ADD ------------------------------------------

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

      return getCatalogue(updatedCatalogue);

      //   const bookEntries = await BookEntry.find({
      //     bookEntryId: { $in: updatedCatalogue.bookEntries },
      //   });

      //   return {
      //     userId: updatedCatalogue.userId,
      //     authors: updatedCatalogue.authors,
      //     bookEntries: bookEntries,
      //   };
    } catch (error) {
      throw error;
    }
  },

  // REMOVE ------------------------------------------
  removeAuthorFromUserCatalogue: async (args) => {
    try {
      const { userId, authorId } = args.input;

      const result = await Catalogue.updateOne(
        { userId: userId },
        { $pull: { authors: authorId } }
      );

      const catalogue = await Catalogue.findOne({ userId: userId });
      return getCatalogue(catalogue);
    } catch (error) {
      throw error;
    }
  },

  removeBookFromUserCatalogue: async (args) => {
    try {
      const { userId, bookId } = args.input;

      const bookEntry = await BookEntry.findOne({ bookId: bookId });
      const resultCatalogue = await Catalogue.updateOne(
        { userId: userId },
        { $pull: { bookEntries: bookEntry.bookEntryId } }
      );
      const resultBookEntry = await BookEntry.deleteOne({ bookId: bookId });

      const catalogue = await Catalogue.findOne({ userId: userId });
      return getCatalogue(catalogue);
    } catch (error) {
      throw error;
    }
  },
};
