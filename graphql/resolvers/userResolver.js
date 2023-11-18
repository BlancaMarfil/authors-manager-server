const User = require("../../models/user");

module.exports = {
  users: async () => {
    try {
      const usersFetched = await User.find();
      return usersFetched.map((user) => {
        return {
          ...user._doc,
          _id: user.id,
        };
      });
    } catch (error) {
      throw error;
    }
  },

  createUser: async (args) => {
    try {
      const { email, password } = args.user;
      const user = new User({
        email,
        password,
      });
      const newUser = await user.save();
      return { ...newUser._doc, _id: newUser.id };
    } catch (error) {
      throw error;
    }
  },
};
