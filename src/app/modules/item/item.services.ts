import { Item, Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";

const createItem = async (
  payload: Omit<Item, "id" | "createdAt" | "updatedAt" | "isDeleted">,
) => {
  return await prisma.item.create({ data: payload });
};

const getAllItems = async (query: Record<string, unknown>) => {
  const { searchTerm, category, maxPrice } = query;

  // Base condition: Item is not soft-deleted
  const where: Prisma.ItemWhereInput = { isDeleted: false };

  // 1. Search filter (Checks title or description)
  if (searchTerm && typeof searchTerm === "string") {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // 2. Category filter (Relational filter)
  if (category && category !== "All" && typeof category === "string") {
    where.category = {
      pet: category, // Matches the 'pet' string in the linked Category model (e.g. "Dogs")
    };
  }

  // 3. Max Price filter
  if (maxPrice) {
    where.price = { lte: Number(maxPrice) };
  }

  return await prisma.item.findMany({
    where,
    // Include the category data in the response so the frontend knows what pet it belongs to
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

const getItemById = async (id: string) => {
  return await prisma.item.findUnique({
    where: { id, isDeleted: false },
    include: { category: true },
  });
};

const updateItem = async (id: string, payload: Partial<Item>) => {
  return await prisma.item.update({
    where: { id },
    data: payload,
  });
};

const deleteItem = async (id: string) => {
  return await prisma.item.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const ItemServices = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
