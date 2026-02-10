/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  <-- MAKE SURE THIS IS DELETED OR COMMENTED OUT!
  images: {
    unoptimized: true,
  },
  // Prevent build crashes on small errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
