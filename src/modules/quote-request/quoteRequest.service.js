import QuoteRequest from "../../models/QuoteRequest.model.js";
import Product from "../../models/Product.model.js";
import {
  create,
  paginate,
  findById,
  findByIdAndUpdate,
  deleteOne,
} from "../../db/database.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export const createQuoteRequest = async (data) => {
  // نتأكد إن المنتج فعلاً موجود ومنشور قبل ما نقبل الطلب عليه
  const product = await Product.findOne({ _id: data.product, status: "published" });
  if (!product) throw ApiError.badRequest("Selected product is not available");

  return create({ model: QuoteRequest, data });
};

export const getQuoteRequests = async ({ page, size, status }) => {
  const filter = {};
  if (status) filter.status = status;

  return paginate({
    model: QuoteRequest,
    filter,
    page: page || 1,
    size: size || 10,
    options: {
      populate: [
        { path: "product", select: "name_en name_ar slug" },
        { path: "handledBy", select: "name email" },
      ],
      sort: { createdAt: -1 },
      lean: true,
    },
  });
};

export const getQuoteRequestById = async (id) => {
  const quoteRequest = await findById({
    model: QuoteRequest,
    id,
    options: { populate: ["product", "handledBy"] },
  });
  if (!quoteRequest) throw ApiError.notFound("Quote request not found");
  return quoteRequest;
};

export const updateQuoteRequest = async (id, data) => {
  const quoteRequest = await findByIdAndUpdate({ model: QuoteRequest, id, update: data });
  if (!quoteRequest) throw ApiError.notFound("Quote request not found");
  return quoteRequest;
};

export const deleteQuoteRequest = async (id) => {
  const result = await deleteOne({ model: QuoteRequest, filter: { _id: id } });
  if (result.deletedCount === 0) throw ApiError.notFound("Quote request not found");
  return result;
};