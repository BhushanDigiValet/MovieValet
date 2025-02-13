import bcrypt from "bcrypt";
import { User } from "../models";
import { generateToken } from "../Auth/auth";



export const login = async (_: any, { input }: any) => {
  const { email, password } = input;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return { token, message: "Login successful" };
};
