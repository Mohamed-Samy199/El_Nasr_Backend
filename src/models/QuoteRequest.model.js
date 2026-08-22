import mongoose from "mongoose";

const quoteRequestSchema = new mongoose.Schema(
  {
    // بيانات المشتري
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },

    // تفاصيل الطلب
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: String, required: true, trim: true }, // نص عشان "20 طن" أو "500 كجم"
    packagingPreference: { type: String, trim: true },
    message: { type: String, trim: true, maxlength: 1000 },

    // إدارة داخلية
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
    },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    internalNote: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, versionKey: "__v" }
);

quoteRequestSchema.index({ status: 1, createdAt: -1 });
quoteRequestSchema.index({ product: 1 });

const QuoteRequest = mongoose.model("QuoteRequest", quoteRequestSchema);
export default QuoteRequest;