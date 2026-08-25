import Product from "../../models/Product.model.js";
import { create, paginate, findByIdAndUpdate, deleteOne, findById } from "../../db/database.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { slugify } from "../../utils/slugify.js";

export const createProduct = async (data, userId) => {
  const slug = slugify(data.name_en);
  return create({ model: Product, data: { ...data, slug, createdBy: userId } });
};

export const getProducts = async ({ page, size, category, status, lang }) => {
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  return paginate({
    model: Product,
    filter,
    page: page || "all",
    size,
    options: { populate: "category", sort: { createdAt: -1 }, lean: true },
  });
};

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, status: "published" }).populate("category").lean();
  if (!product) throw ApiError.notFound("Product not found");
  return product;
};

export const updateProduct = async (id, data) => {
  if (data.name_en) data.slug = slugify(data.name_en);
  const product = await findByIdAndUpdate({ model: Product, id, update: data });
  if (!product) throw ApiError.notFound("Product not found");
  return product;
};

export const deleteProduct = async (id) => {
  const result = await deleteOne({ model: Product, filter: { _id: id } });
  if (result.deletedCount === 0) throw ApiError.notFound("Product not found");
  return result;
};

export const attachImages = async (id, images) => {
  const product = await findByIdAndUpdate({
    model: Product,
    id,
    update: { $push: { images: { $each: images } } },
  });
  if (!product) throw ApiError.notFound("Product not found");
  return product;
};

export const getProductById = async (id) => {
  const product = await findById({
    model: Product,
    id,
    options: { populate: "category", lean: true },
  });
  if (!product) throw ApiError.notFound("Product not found");
  return product;
};


export const removeImage = async (productId, publicId) => {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound("Product not found");

  const imageExists = product.images.some((img) => img.public_id === publicId);
  if (!imageExists) throw ApiError.notFound("Image not found on this product");

  await deleteCloudinaryImage(publicId);

  product.images = product.images.filter((img) => img.public_id !== publicId);
  await product.save();

  return product;
};