import { z } from "zod";

const createItemValidation = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }),
    categoryId: z.string({ message: "Category ID is required" }),
    price: z.number({ message: "Price is required" }),
    description: z.string({ message: "Description is required" }),
    fullDescription: z.string({ message: "Full description is required" }),
    images: z
      .array(z.string())
      .min(1, { message: "At least one image URL is required" }),
    icon: z.string({ message: "Icon name is required" }),
    color: z.string({ message: "Color class is required" }),
    bg: z.string({ message: "Background class is required" }),
  }),
});

const updateItemValidation = z.object({
  body: createItemValidation.shape.body.partial(),
});

export const ItemValidation = { createItemValidation, updateItemValidation };
