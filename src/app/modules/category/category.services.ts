import { Category } from "@prisma/client";
import { prisma } from "../../shared/prisma";

const createCategory = async (
  payload: Omit<Category, "id" | "createdAt" | "updatedAt" | "isDeleted">,
) => {
  return await prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "asc" },
  });
};

const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id, isDeleted: false },
  });
};

const updateCategory = async (id: string, payload: Partial<Category>) => {
  return await prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  // Soft Delete
  return await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
