import "dotenv/config";
import app from "./app.bootstrap.js";
import { connectDB } from "./db/connection.db.js";
import User from "./models/User.model.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();

  // const resetResult = await User.updateMany(
  //   { isOnline: true },
  //   { $set: { isOnline: false } }
  // );
  // if (resetResult.modifiedCount > 0) {
  //   console.log(`🔄 Reset isOnline for ${resetResult.modifiedCount} user(s) after restart.`);
  // }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
};

start();