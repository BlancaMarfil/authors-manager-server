const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  userById: async (args) => {
    const { userId } = args;
    try {
      const userFound = await User.findOne({ userId: userId });
      return {
        userId: userFound.userId,
        email: userFound.email,
      };
    } catch (error) {
      throw error;
    }
  },

  userByToken: async (args) => {
    const { token } = args;
    try {
      const userFound = await User.findOne({ token: token });
      return {
        userId: userFound.userId,
        email: userFound.email,
      };
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

      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        "secret-key",
        { expiresIn: "1h" }
      );
      user["token"] = token;

      const newUser = await user.save();
      return {
        userId: newUser.userId,
        email: newUser.email,
        token: newUser.token,
      };
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (args) => {
    const { email, password } = args.credentials;

    const user = await User.findOne({ email });
    console.log("USETR", user);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("IS PASSWORD MARTCH", isPasswordMatch);

    if (!isPasswordMatch) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      "secret-key",
      { expiresIn: "1h" }
    );

    console.log("TOKEN", token);

    const updatedUser = await User.findOneAndUpdate(
      { userId: user.userId },
      { $set: { token: token } },
      { new: true, upsert: true } // Return the updated document and create if not found
    );

    return {
      userId: updatedUser.userId,
      email: updatedUser.email,
      token: updatedUser.token,
    };
  },
};
