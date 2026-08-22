import Product from "../../models/Product.model.js";
import Category from "../../models/Category.model.js";
import QuoteRequest from "../../models/QuoteRequest.model.js";

export const getStats = async () => {
  const [totalProducts, publishedProducts, draftProducts, totalCategories, newQuoteRequests, totalQuoteRequests] =
    await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "published" }),
      Product.countDocuments({ status: "draft" }),
      Category.countDocuments({ isActive: true }),
      QuoteRequest.countDocuments({ status: "new" }),
      QuoteRequest.countDocuments(),
    ]);

  return {
    products: {
      total: totalProducts,
      published: publishedProducts,
      draft: draftProducts,
    },
    categories: {
      total: totalCategories,
    },
    quoteRequests: {
      new: newQuoteRequests,
      total: totalQuoteRequests,
    },
  };
};