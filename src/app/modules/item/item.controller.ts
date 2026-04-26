import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ItemServices } from "./item.services";
import { fileUploader } from "../../utils/fileUploader";

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
  sendResponse(res, { statusCode: 201, success: true, message: "Item forged perfectly with images!", data: result });
});

// ... keep your other controllers exactly the same (getAllItems, getItemById, etc.)
const getAllItems = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemServices.getAllItems(req.query);
  sendResponse(res, { statusCode: 200, success: true, message: "Items retrieved", data: result });
});

const getItemById = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemServices.getItemById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Item details retrieved", data: result });
});

const updateItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemServices.updateItem(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Item updated", data: result });
});

const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemServices.deleteItem(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Item safely removed", data: result });
});

export const ItemController = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};