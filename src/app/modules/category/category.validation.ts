import { z } from "zod";

const createCategoryValidation = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }),
    pet: z.string({ message: "Pet type is required" }),
    description: z.string({ message: "Description is required" }),
    icon: z.string({ message: "Icon name is required" }),
    color: z.string({ message: "Color class is required" }),
    bg: z.string({ message: "Background class is required" }),
    borderColor: z.string({ message: "Border color class is required" }),
    shadow: z.string({ message: "Shadow class is required" }),
  }),
});

const updateCategoryValidation = z.object({
  body: createCategoryValidation.shape.body.partial(),
});

export const CategoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};