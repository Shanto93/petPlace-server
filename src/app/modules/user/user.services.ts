import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";

const createUser = async (req: Request) => {
  // Safe Cloudinary check
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    if (uploadResult) {
      req.body.user.profilePhoto = uploadResult;
    }
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.bcrypt.salt_rounds) || 12,
  );

  const result = await prisma.$transaction(async (tnx) => {
    // 1. Create Login Credential
    const newUser = await tnx.user.create({
      data: {
        email: req.body.user.email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    // 2. Create the E-commerce Profile
    const newProfile = await tnx.authenticatedUser.create({
      data: {
        ...req.body.user,
        email: newUser.email,
      },
    });

    return newProfile;
  });

  return result;
};

const createAdmin = async (req: Request) => {
  // Safe Cloudinary check
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    if (uploadResult) {
      req.body.admin.profilePhoto = uploadResult;
    }
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.bcrypt.salt_rounds) || 12,
  );

  const result = await prisma.$transaction(async (tnx) => {
    // 1. Create Admin Credential
    const newUser = await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    // 2. Create Admin Profile
    const newAdmin = await tnx.admin.create({
      data: {
        ...req.body.admin,
        email: newUser.email,
      },
    });

    return newAdmin;
  });

  return result;
};

export const UserServices = {
  createUser,
  createAdmin,
};
