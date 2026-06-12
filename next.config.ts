import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        API_URL: process.env.API_URL || "https://crmapi.sandboxtechnology.in/api",
    },
};

export default nextConfig;
