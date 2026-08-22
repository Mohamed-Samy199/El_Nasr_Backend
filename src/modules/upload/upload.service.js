import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";
import { ApiError } from "../../utils/ApiError.js";

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "elnasr/products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadImages = async (files) => {
  if (!files || files.length === 0) {
    throw ApiError.badRequest("No images provided");
  }

  const uploads = await Promise.all(files.map((file) => streamUpload(file.buffer)));

  return uploads.map((result) => ({
    url: result.secure_url,
    public_id: result.public_id,
  }));
};

export const deleteImage = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};