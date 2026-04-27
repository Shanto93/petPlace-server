// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import multer from "multer";
// import config from "../../config";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + "/uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// const upload = multer({ storage: storage });

// const uploadToCloudinary = async (file: Express.Multer.File) => {
//   // console.log(file);
//   cloudinary.config({
//     cloud_name: config.cloudinary.cloud_name,
//     api_key: config.cloudinary.api_key,
//     api_secret: config.cloudinary.api_secret,
//   });

//   // Upload an image
//   const uploadResult = await cloudinary.uploader
//     .upload(file.path, {
//       public_id: file.filename,
//       folder: "petPlace/pets",
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   if (uploadResult) {
//     fs.unlink(file.path, (err) => {
//       if (err) {
//         console.error("Error deleting file:", err);
//       } else {
//         // console.log("File deleted successfully");
//       }
//     });
//   }

//   return uploadResult?.secure_url;
// };

// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "../../config";

// 1. Use Memory Storage to prevent disk write errors on cloud servers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: Express.Multer.File,
): Promise<string> => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });

  // 2. Wrap Cloudinary upload in a strict Promise so it doesn't fail silently
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "petPlace/pets" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error("Cloudinary upload failed"));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Unknown Cloudinary error"));
        }
      },
    );

    // Stream the file directly from memory
    uploadStream.end(file.buffer);
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
