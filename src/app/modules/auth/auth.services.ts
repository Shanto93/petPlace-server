// import { UserStatus } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import { Secret, SignOptions } from "jsonwebtoken";
// import config from "../../../config";
// import AppError from "../../middlewares/AppError";
// import { prisma } from "../../shared/prisma";
// import { generateToken } from "../../utils/generateToken";
// import { IAuthInfo } from "./auth.interfaces";

// const login = async (payload: IAuthInfo) => {
//   const user = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: payload.email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   const needPasswordChange = user.needPasswordChange;

//   // 2. Verify password
//   const isPasswordMatched = await bcrypt.compare(
//     payload.password,
//     user.password,
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(400, "Invalid password");
//   }

//   // 3. Generate JWT Tokens
//   const jwtPayload = { email: user.email, role: user.role };

//   const accessToken = generateToken(
//     jwtPayload,
//     config.jwt.access_token_secret as Secret,
//     config.jwt.access_token_expiration as SignOptions["expiresIn"],
//   );

//   const refreshToken = generateToken(
//     jwtPayload,
//     config.jwt.refresh_token_secret as Secret,
//     config.jwt.refresh_token_expiration as SignOptions["expiresIn"],
//   );

//   return {
//     id: user.id,
//     accessToken,
//     refreshToken,
//     needPasswordChange,
//   };
// };

// export const AuthServices = {
//   login,
// };

import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Secret, SignOptions } from "jsonwebtoken";
import config from "../../../config";
import AppError from "../../middlewares/AppError";
import { prisma } from "../../shared/prisma";
import { generateToken } from "../../utils/generateToken";
import { IAuthInfo } from "./auth.interfaces";

const login = async (payload: IAuthInfo) => {
  // 1. Find user and INCLUDE the associated profile (Admin or AuthenticatedUser)
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: true,
      authenticatedUser: true,
    },
  });

  // 2. Verify password
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(400, "Invalid password");
  }

  // 3. Extract the correct Profile ID (The UUID String)
  // Your Cart and Orders use this UUID, not the User table Integer ID.
  const profileId =
    user.role === "ADMIN" ? user.admin?.id : user.authenticatedUser?.id;

  if (!profileId) {
    throw new AppError(404, "User profile not found. Please contact support.");
  }

  // 4. Generate JWT Tokens (Include the profile ID in the payload)
  const jwtPayload = {
    id: profileId, // This ensures the token carries the UUID
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expiration as SignOptions["expiresIn"],
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expiration as SignOptions["expiresIn"],
  );

  return {
    id: profileId, // Returning the UUID string to the controller
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthServices = {
  login,
};
