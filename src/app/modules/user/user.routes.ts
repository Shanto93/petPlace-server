import { UserRole } from "@prisma/client";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-user",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // FIX: Using || "{}" to prevent undefined crash
    req.body = UserValidation.createUserValidation.parse(
      JSON.parse(req.body.data || "{}"),
    );
    return UserController.createUser(req, res, next);
  },
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // FIX: Using || "{}" to prevent undefined crash
    req.body = UserValidation.createAdminValidation.parse(
      JSON.parse(req.body.data || "{}"),
    );
    return UserController.createAdmin(req, res, next);
  },
);

export const userRoutes = router;
