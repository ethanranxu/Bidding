import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 必须添加以下实验性配置来解锁跨域 Server Actions 校验
  experimental: {
    serverActions: {
      allowedOrigins: ["bidding.duminet.com", "*.vercel.app"],
    },
  },
};

export default nextConfig;