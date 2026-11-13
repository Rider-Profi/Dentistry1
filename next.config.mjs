import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const legacyDoctorSlugs = createRequire(import.meta.url)("./prisma/doctor-aliases.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  async redirects() {
    return Object.entries(legacyDoctorSlugs).map(([previous, current]) => ({
      source: `/doctors/${previous}`,
      destination: `/doctors/${current}`,
      permanent: true
    }));
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  serverExternalPackages: ["bcryptjs", "exceljs"]
};

export default nextConfig;
