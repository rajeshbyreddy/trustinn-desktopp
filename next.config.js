/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
