import { User } from "../models";
import { validateRoleCreation } from "../Auth/authorization";
import { hashPassword, validateCredentials } from "../Auth/auth";
import { log } from "console";

export const register = async (
  _: any,
  {
    input,
  }: {
    input: {
      username: string;
      email: string;
      password: string;
      role: string;
    };
  },
  context
) => {
  const { username, email, password, role } = input;
  
  validateRoleCreation(role, context);


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const newUser = new User({
    username,
    email,
    passwordHash,
    role,
    createdBy: context.user ? context.user.id : undefined,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await newUser.save();

  return {
    username: username,
    email: email,
    role: role,
    message: "User registered successfully",
  };
};
