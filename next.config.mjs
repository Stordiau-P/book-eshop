/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? "/book-eshop" : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? "/book-eshop/" : '',
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;
