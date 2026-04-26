import z from "zod";

const createUserValidation = z.object({
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password must be less than 12 characters"),
  user: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be less than 50 characters"),
    email: z.email("Invalid email address"),
    contactNumber: z.string(),
    address: z.string().optional(),
    role: z.enum(["USER"]).default("USER"),
  }),
});

const createAdminValidation = z.object({
  password: z.string({
    error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      error: "Name is required!",
    }),
    email: z.string({
      error: "Email is required!",
    }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
    role: z.enum(["ADMIN"]).default("ADMIN"),
  }),
});

export const UserValidation = {
  createUserValidation,
  createAdminValidation,
};
