import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewarePrefetch: 'strict', // Garante que o middleware seja executado
  },
};

export default nextConfig;
