import express from "express";
import { fileUploader } from "../../utils/fileUploader"; // Adjust the path if needed
import { ItemController } from "./item.controller";

const router = express.Router();

// Use .array("images", 5) to accept up to 5 files under the field name "images"
router.post(
  "/",
  fileUploader.upload.array("images", 5),
  ItemController.createItem,
);

router.get("/", ItemController.getAllItems);
router.get("/:id", ItemController.getItemById);
router.patch("/:id", ItemController.updateItem);
router.delete("/:id", ItemController.deleteItem);

export const itemRoutes = router;
