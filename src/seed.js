// import mongoose from "mongoose";
// import { MONGODB_URI } from "./config/env.config.js";
// import User from "./models/User.model.js";

// // ── إعدادات أول Admin ──────────────────────────────────────────────────────────
// // ممكن تغيّرهم من هنا مباشرة، أو تحطهم في متغيرات بيئة لو حابب تخفيهم من الكود.
// const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "System Admin";
// const ADMIN_MILITARY_NUMBER = process.env.SEED_ADMIN_MILITARY_NUMBER || "0000001";
// const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

// const connect = async () => {
//   await mongoose.connect(MONGODB_URI);
//   console.log("✅ Connected to MongoDB");
// };

// const seedAdmin = async () => {
//   const existing = await User.findOne({ militaryNumber: ADMIN_MILITARY_NUMBER });

//   if (existing) {
//     console.log("⚠️  Admin already exists — skipping.");
//     console.log("   Military Number:", ADMIN_MILITARY_NUMBER);
//     return existing;
//   }

//   const admin = await User.create({
//     name: ADMIN_NAME,
//     militaryNumber: ADMIN_MILITARY_NUMBER,
//     password: ADMIN_PASSWORD, // هيتهاش تلقائيًا عبر pre-save hook
//     role: "admin",
//     isActive: true,
//     mustChangePassword: true, // يجبر الـ admin يغيرها أول ما يدخل
//   });

//   console.log("✅ Admin created successfully:");
//   console.log("   Military Number:", ADMIN_MILITARY_NUMBER);
//   console.log("   Password       :", ADMIN_PASSWORD);
//   console.log("   ⚠️  غيّر كلمة السر فورًا بعد أول تسجيل دخول!");

//   return admin;
// };

// const run = async () => {
//   try {
//     await connect();
//     await seedAdmin();
//     console.log("\n🎉 Seed completed successfully!");
//   } catch (err) {
//     console.error("❌ Seed failed:", err.message);
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 Disconnected from MongoDB");
//     process.exit(0);
//   }
// };

// run();


import mongoose from "mongoose";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, MONGODB_URI } from "./config/env.config.js";
import User from "./models/User.model.js";
import Category from "./models/Category.model.js";
import Product from "./models/Product.model.js";
import { slugify } from "./utils/slugify.js";

// ── إعدادات أول Admin ──────────────────────────────────────────────────────────
// ممكن تغيّرهم من هنا مباشرة، أو تحطهم في متغيرات بيئة لو حابب تخفيهم من الكود.


const connect = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");
};

const seedAdmin = async () => {
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    console.log("⚠️  Admin already exists — skipping.");
    console.log("   Email:", ADMIN_EMAIL);
    return existing;
  }

  const admin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD, // هيتهاش تلقائيًا عبر pre-save hook
    role: "admin",
    isActive: true,
  });

  console.log("✅ Admin created successfully:");
  console.log("   Email   :", ADMIN_EMAIL);
  console.log("   Password:", ADMIN_PASSWORD);
  console.log("   ⚠️  غيّر كلمة السر فورًا بعد أول تسجيل دخول!");

  return admin;
};

const seedCategories = async (adminId) => {
  const count = await Category.countDocuments();
  if (count > 0) {
    console.log("⚠️  Categories already exist — skipping.");
    return Category.find();
  }

  const categoriesData = [
    {
      name_en: "Legumes",
      name_ar: "بقوليات",
      description_en: "Beans, lentils, and other legumes sourced from Egyptian farms.",
      description_ar: "فاصوليا وعدس وبقوليات أخرى من المزارع المصرية.",
    },
    {
      name_en: "Seeds",
      name_ar: "بذور",
      description_en: "High-quality seeds for local and international markets.",
      description_ar: "بذور عالية الجودة للأسواق المحلية والدولية.",
    },
    {
      name_en: "Other Crops",
      name_ar: "محاصيل أخرى",
      description_en: "Additional agricultural crops and produce.",
      description_ar: "محاصيل زراعية ومنتجات إضافية.",
    },
  ];

  const categories = await Category.insertMany(
    categoriesData.map((cat) => ({ ...cat, slug: slugify(cat.name_en) }))
  );

  console.log(`✅ ${categories.length} categories created`);
  return categories;
};

const seedProducts = async (categories, adminId) => {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log("⚠️  Products already exist — skipping.");
    return;
  }

  const legumes = categories.find((c) => c.slug === "legumes");
  const seeds = categories.find((c) => c.slug === "seeds");

  const productsData = [
    {
      name_en: "White Beans",
      name_ar: "فاصوليا بيضاء",
      category: legumes._id,
      description_en: "Premium white beans, sun-dried and cleaned for export.",
      description_ar: "فاصوليا بيضاء ممتازة، مجففة ومنظفة للتصدير.",
      origin_en: "Nile Delta, Egypt",
      origin_ar: "دلتا النيل، مصر",
      season_en: "Summer harvest",
      season_ar: "حصاد صيفي",
      grade_en: "Grade A",
      grade_ar: "درجة أولى",
      packaging_en: "25kg / 50kg PP bags",
      packaging_ar: "أكياس بولي بروبلين 25 كجم / 50 كجم",
      minOrderQty: "1 ton",
      status: "published",
      createdBy: adminId,
    },
    {
      name_en: "Fava Beans",
      name_ar: "فول",
      category: legumes._id,
      description_en: "Traditional Egyptian fava beans, carefully sorted.",
      description_ar: "فول مصري تقليدي، مفروز بعناية.",
      origin_en: "Menoufia, Egypt",
      origin_ar: "المنوفية، مصر",
      season_en: "Autumn harvest",
      season_ar: "حصاد خريفى",
      packaging_en: "25kg jute bags",
      packaging_ar: "أكياس جوت 25 كجم",
      minOrderQty: "1 ton",
      status: "published",
      createdBy: adminId,
    },
    {
      name_en: "Sesame Seeds",
      name_ar: "سمسم",
      category: seeds._id,
      description_en: "Clean, high-purity sesame seeds for export markets.",
      description_ar: "سمسم نظيف عالي النقاوة لأسواق التصدير.",
      packaging_en: "25kg bags",
      packaging_ar: "أكياس 25 كجم",
      minOrderQty: "500 kg",
      status: "draft",
      createdBy: adminId,
    },
  ];

  const products = await Product.insertMany(
    productsData.map((p) => ({ ...p, slug: slugify(p.name_en) }))
  );

  console.log(`✅ ${products.length} products created`);
};

const run = async () => {
  try {
    await connect();
    const admin = await seedAdmin();
    const categories = await seedCategories(admin._id);
    await seedProducts(categories, admin._id);
    console.log("\n🎉 Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

run();