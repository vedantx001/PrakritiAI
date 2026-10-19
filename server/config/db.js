import dns from "dns";
import mongoose from "mongoose";

// Resolve DNS SRV lookups using Google/Cloudflare DNS to prevent querySrv ECONNREFUSED on local ISP/routers
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  console.warn("⚠️ Could not set custom DNS servers:", dnsErr.message);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
    console.log(`🌐 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;