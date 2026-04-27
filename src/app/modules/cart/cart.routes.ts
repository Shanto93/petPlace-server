// import express from "express";
// import { CartController } from "./cart.controller";

// const router = express.Router();

// // Add to cart
// router.post("/", CartController.addToCart);

// // Get a specific user's cart (e.g., GET /api/cart/user/123-abc)
// router.get("/user/:userId", CartController.getMyCart);

// // Update specific cart item quantity (e.g., PATCH /api/cart/item-id)
// router.patch("/:id", CartController.updateCartItemQuantity);

// // Remove specific item from cart
// router.delete("/:id", CartController.removeFromCart);

// export const cartRoutes = router;

import { UserRole } from "@prisma/client"; // Import your roles
import express from "express";
import auth from "../../middlewares/auth"; // Your authentication middleware
import { CartController } from "./cart.controller";

const router = express.Router();

// 1. Add to cart (Protected: Only logged-in USERS can add items)
router.post(
  "/",
  auth(UserRole.USER),
  // validateRequest(CartValidation.addToCart), // Uncomment this if you have Zod validation
  CartController.addToCart,
);

// 2. Get a specific user's cart
router.get(
  "/user/:userId",
  auth(UserRole.USER, UserRole.ADMIN), // Users see their own, Admins can oversee
  CartController.getMyCart,
);

// 3. Update specific cart item quantity
router.patch(
  "/:id",
  auth(UserRole.USER),
  CartController.updateCartItemQuantity,
);

// 4. Remove specific item from cart
router.delete("/:id", auth(UserRole.USER), CartController.removeFromCart);

export const cartRoutes = router;
