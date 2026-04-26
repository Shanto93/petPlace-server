import express from "express";
import { CategoryController } from "./category.controller";

const router = express.Router();

// NOTE: Add your auth/validate middleware here later if you want to protect POST/PATCH/DELETE
router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.patch("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export const categoryRoutes = router;