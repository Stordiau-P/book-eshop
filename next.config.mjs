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
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

// ✅ Déclare userConfig avant de l'utiliser
const userConfig = {}; // Ou charge tes configs dynamiques ici

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return nextConfig; // ✅ Retourne nextConfig si userConfig est vide
  }

  for (const key in userConfig) {
    if (
        typeof nextConfig[key] === 'object' &&
        !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }

  return nextConfig; // ✅ Retourne le nouvel objet config
}

// ✅ Appelle mergeConfig et exporte le résultat
export default mergeConfig(nextConfig, userConfig);
