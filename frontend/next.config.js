/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Disabled for Custom Server (NestJS)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
