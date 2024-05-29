import User from "../modules/UserModule.js";
import argon2 from "argon2";

//#######################--Get users--#######################\\
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//#######################--Get users by id--#######################\\
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//#######################--Create users--#######################\\
export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Passwords do not match!" });
  }

  try {
    const hashedPassword = await argon2.hash(password);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//#######################--Update users--#######################\\
export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { name, email, password, confPassword, role } = req.body;

    if (password && password !== confPassword) {
      return res.status(400).json({ msg: "Passwords do not match!" });
    }

    let hashedPassword = user.password;

    if (password) {
      hashedPassword = await argon2.hash(password);
    }

    await User.update(
      {
        name,
        email,
        password: hashedPassword,
        role,
      },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//#######################--Delete users--#######################\\
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.destroy({
      where: {
        uuid: req.params.id,
      },
    });

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
