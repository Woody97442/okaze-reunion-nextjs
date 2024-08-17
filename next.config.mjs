/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false, // À activer si vous voulez un mode strict pour React
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9furg9ixi3wjuc9w.public.blob.vercel-storage.com",
        port: "", // Facultatif, si vous avez besoin d'un port spécifique
        pathname: "/**", // Correspond à tous les chemins sous ce domaine
      },
    ],
  },
};

export default nextConfig;
