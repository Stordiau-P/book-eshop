/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 🔥 Permet d'exporter en statique pour GitHub Pages
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // 🚀 Désactive l'optimisation des images (sinon erreur sur GitHub Pages)
  },
  basePath: "/nom-du-repo", // ⚠️ Remplace par le nom EXACT de ton repo GitHub
  assetPrefix: "/nom-du-repo/",
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;
