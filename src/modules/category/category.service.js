import Category from "../../models/Category.model.js";
import { create, find, findOne, findByIdAndUpdate, deleteOne } from "../../db/database.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { slugify } from "../../utils/slugify.js";

export const createCategory = async (data) => {
  const slug = slugify(data.name_en);
  const existing = await findOne({ model: Category, filter: { slug } });
  if (existing) throw ApiError.conflict("Category with this name already exists");

  return create({ model: Category, data: { ...data, slug } });
};

export const getAllCategories = async () => {
  return find({ model: Category, filter: { isActive: true }, options: { sort: { createdAt: -1 } } });
};

export const updateCategory = async (id, data) => {
  const category = await findByIdAndUpdate({ model: Category, id, update: data });
  if (!category) throw ApiError.notFound("Category not found");
  return category;
};

export const deleteCategory = async (id) => {
  const result = await deleteOne({ model: Category, filter: { _id: id } });
  if (result.deletedCount === 0) throw ApiError.notFound("Category not found");
  return result;
};