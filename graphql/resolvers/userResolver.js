const User = require("../../models/user");
const bcrypt = require("bcrypt");

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
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email: email,
        password: hashedPassword,
      });
      const newUser = await user.save();
      return { userId: newUser.userId, email: newUser.email };
    } catch (error) {
      throw error;
    }
  },
};
