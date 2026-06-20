/** @type {import('next').NextConfig} */
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'Bekjan';
const basePath = `/${repoName}`;
const assetPrefix = `${basePath}/`;

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix,
  trailingSlash: true,
  images: {
    // Для статического экспорта отключаем оптимизацию image (next/image)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  }
};

module.exports = nextConfig;
