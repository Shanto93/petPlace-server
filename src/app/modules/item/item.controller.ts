import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { fileUploader } from "../../utils/fileUploader";
import { ItemServices } from "./item.services";

const createItem = catchAsync(async (req: Request, res: Response) => {
  // 1. Parse the stringified JSON data sent from the frontend/Postman
  let itemData;
  if (req.body.data) {
    itemData = JSON.parse(req.body.data);
  } else {
    itemData = { ...req.body };
  }

  // 2. Handle Multiple Image Uploads to Cloudinary
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls: string[] = [];

    // Loop through each uploaded file
    for (const file of req.files) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      if (uploadResult) {
        imageUrls.push(uploadResult);
      }
    }

    // Assign the generated Cloudinary URLs to the itemData
    itemData.images = imageUrls;
  } else {
    // If no files were uploaded but the validation requires images
    itemData.images = [];
  }

  // 3. Save to database
  const result = await ItemServices.createItem(itemData);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Item forged perfectly with images!",
    data: result,
  });
});

// ... keep your other controllers exactly the same (getAllItems, getItemById, etc.)
const getAllItems = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemServices.getAllItems(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Items retrieved",
    data: result,
  });
});

const getItemById = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemServices.getItemById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item details retrieved",
    data: result,
  });
});

// const updateItem = catchAsync(async (req: Request, res: Response) => {
//   const result = await ItemServices.updateItem(req.params.id, req.body);
//   sendResponse(res, { statusCode: 200, success: true, message: "Item updated", data: result });
// });

const updateItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 1. Parse the stringified JSON data
  let updateData: any = {};
  if (req.body.data) {
    try {
      updateData = JSON.parse(req.body.data);
    } catch (e) {
      throw new Error("Failed to parse incoming JSON data.");
    }
  } else {
    updateData = { ...req.body };
  }

  // 2. Formatting & Cleanup
  delete updateData.id;
  delete updateData._id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  if (updateData.price !== undefined && updateData.price !== null) {
    updateData.price = Number(updateData.price);
  }

  if (
    !updateData.categoryId ||
    updateData.categoryId === "undefined" ||
    updateData.categoryId === "null"
  ) {
    delete updateData.categoryId;
  }

  // ==========================================
  // 3. THE IMAGE FIX: Match createItem logic
  // ==========================================

  // Start with the existing images (the ones the user kept)
  let finalImages: string[] = Array.isArray(updateData.images)
    ? updateData.images
    : [];

  // Upload any newly added files
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    for (const file of req.files) {
      const newUrl = await fileUploader.uploadToCloudinary(file);
      if (newUrl) {
        finalImages.push(newUrl); // Push the new secure_url
      }
    }
  }

  // DIRECT ASSIGNMENT: No more { set: ... } wrapper.
  // We pass the array exactly like you do in createItem!
  updateData.images = finalImages;
  // ==========================================

  // 4. Send to Database
  const result = await ItemServices.updateItem(id, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item details AND images updated successfully!",
    data: result,
  });
});

const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemServices.deleteItem(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item safely removed",
    data: result,
  });
});

export const ItemController = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
