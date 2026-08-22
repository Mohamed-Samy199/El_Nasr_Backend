import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage(); // مبنخزنش على الديسك، بنرفع مباشرة لـ Cloudinary

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(ApiError.badRequest("Only JPEG, PNG, and WEBP images are allowed"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB لكل صورة، 5 صور كحد أقصى
});