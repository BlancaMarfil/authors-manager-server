const Catalogue = require("../../models/catalogue");
const BookEntry = require("../../models/bookEntry");
const uuid = require("uuid");

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

const formatDate = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
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

  catalogueByUserId: async (args) => {
    const { userId } = args;
    try {
      const catalogue = await Catalogue.findOne({ userId: userId });
      return getCatalogue(catalogue);
    } catch (error) {
      throw error;
    }
  },

  lastBookReadByUserId: async (args) => {
    const { userId } = args;
    try {
      const catalogue = await Catalogue.findOne({ userId: userId });
      const bookEntries = await BookEntry.find({
        bookEntryId: { $in: catalogue.bookEntries },
      });

      const sortedBookEntries = bookEntries.sort((a, b) => {
        const dateA = formatDate(a.dateRead);
        const dateB = formatDate(b.dateRead);
        return dateB - dateA;
      });

      return sortedBookEntries.length > 0 && sortedBookEntries[0];
    } catch (error) {
      throw error;
    }
  },

  findAuthorbyName: async (args) => {
    const { userId, authorName } = args.input;
    try {
      const catalogue = await Catalogue.find({
        userId: userId,
        authors: { $in: [authorName] },
      });
      return catalogue.length > 0;
    } catch (error) {
      throw error;
    }
  },

  bookReadByUser: async (args) => {
    const { userId, bookId } = args.input;
    try {
      const result = await Catalogue.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $unwind: "$bookEntries",
        },
        {
          $lookup: {
            from: "bookentries",
            localField: "bookEntries",
            foreignField: "bookEntryId",
            as: "bookEntry",
          },
        },
        {
          $unwind: "$bookEntry",
        },
        {
          $match: { "bookEntry.bookId": bookId },
        },
        {
          $project: {
            userId: 1,
            bookEntry: 1,
          },
        },
      ]);

      if (result.length > 0) {
        const { bookId, bookEntryId, dateRead } = result[0].bookEntry;
        return { bookId, bookEntryId, dateRead };
      } else return null;
    } catch (error) {
      throw error;
    }
  },

  // ADD ------------------------------------------

  addAuthorToUserCatalogue: async (args) => {
    try {
      const { userId, authorName } = args.input;

      const updatedCatalogue = await Catalogue.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { authors: authorName } }, // $addToSet ensures unique values in the array
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
        {
          $set: { bookId: bookId, dateRead: dateRead, bookEntryId: uuid.v4().slice(0, 10) },
        },
        { new: true, upsert: true } // Return the updated document and create if not found
      );

      const updatedCatalogue = await Catalogue.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { bookEntries: updatedBookEntry.bookEntryId } }, // $addToSet ensures unique values in the array
        { new: true, upsert: true } // Return the updated document and create if not found
      );

      return getCatalogue(updatedCatalogue);
    } catch (error) {
      throw error;
    }
  },

  // REMOVE ------------------------------------------
  removeAuthorFromUserCatalogue: async (args) => {
    try {
      const { userId, authorName } = args.input;

      const result = await Catalogue.updateOne(
        { userId: userId },
        { $pull: { authors: authorName } }
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
