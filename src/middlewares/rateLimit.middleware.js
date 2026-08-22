import rateLimit from "express-rate-limit";


export const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 
  max: 1000, // 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "عدد الطلبات كبير جدًا، حاول تاني بعد قليل.",
  },
});   


export const quoteRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة
  max: 5, // 5 طلبات بس لكل IP في الساعة
  message: { success: false, message: "Too many quote requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});