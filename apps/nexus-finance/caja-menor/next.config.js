/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nexus/ui", "@nexus/utils", "@nexus/prisma"],
};

module.exports = nextConfig;