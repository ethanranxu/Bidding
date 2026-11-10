import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/bidding",
  // 必须添加以下实验性配置来解锁跨域 Server Actions 校验
  experimental: {
    serverActions: {
      allowedOrigins: ["bidding.duminet.com", "*.vercel.app"],
    },
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/bidding",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;