const BookEntry = require("../../models/bookEntry");

module.exports = {
  bookEntryById: async (args) => {
    const { bookEntryId } = args;
    try {
      const bookFound = await BookEntry.findOne({ bookEntryId: bookEntryId });
      return {
        bookEntryId: bookFound.bookEntryId,
        bookId: bookFound.bookId,
        dateRead: bookFound.dateRead,
      };
    } catch (error) {
      throw error;
    }
  },

  //   createBookEntry: async (args) => {
  //     try {
  //       const { dateRead } = args.input;
  //       const bookEntry = new BookEntry({ dateRead });
  //       const newBookEntry = await bookEntry.save();
  //       return { ...newBookEntry._doc, _id: newBookEntry.id };
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
};
