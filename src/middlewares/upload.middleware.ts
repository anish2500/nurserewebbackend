import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const maxSize = 2 * 1024 * 1024; // 2MB for images

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    if (file.fieldname === "profilePicture") {
      cb(null, path.join("public", "profile_pictures"));
    } else {
      return cb(new Error("Invalid field name for upload."), "");
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const prefix = "pro-pic";
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === "profilePicture") {
    console.log("Profile picture upload detected");
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      cb(new Error("Image format not supported."));
      return;
    }
    cb(null, true);
    return;
  } else {
    cb(new Error("Invalid field name for upload."));
    return;
  }
};

// For profile pictures
export const uploadProfilePicture = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize },
});

// Export for backward compatibility
export const uploadImage = uploadProfilePicture;
export const upload = uploadProfilePicture;
