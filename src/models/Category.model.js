import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name_en: { type: String, required: true, trim: true },
    name_ar: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description_en: { type: String, trim: true },
    description_ar: { type: String, trim: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: "__v" }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;