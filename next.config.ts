import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://127.0.0.1:8000/api/";
const mediaHost = (() => {
  try {
    return new URL(apiUrl).hostname;
  } catch {
    return "127.0.0.1";
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: mediaHost },
      { protocol: "https", hostname: mediaHost },
    ],
  },
};

export default nextConfig;
