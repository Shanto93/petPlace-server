import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { cartRoutes } from "../modules/cart/cart.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { itemRoutes } from "../modules/item/item.routes";
import { userRoutes } from "../modules/user/user.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/item",
    route: itemRoutes,
  },
  {
    path: "/cart",
    route: cartRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
