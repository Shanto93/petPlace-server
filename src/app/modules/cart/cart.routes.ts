import express from "express";
import { CartController } from "./cart.controller";

const router = express.Router();

// Add to cart
router.post("/", CartController.addToCart);

// Get a specific user's cart (e.g., GET /api/cart/user/123-abc)
router.get("/user/:userId", CartController.getMyCart);

// Update specific cart item quantity (e.g., PATCH /api/cart/item-id)
router.patch("/:id", CartController.updateCartItemQuantity);

// Remove specific item from cart
router.delete("/:id", CartController.removeFromCart);

export const cartRoutes = router;
