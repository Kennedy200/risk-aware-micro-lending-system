/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ SPEED BOOST 1: Enable image optimization
  images: {
    unoptimized: false, // Changed from true
    formats: ['image/webp', 'image/avif'],
    domains: ['localhost'],
  },



  // ✅ SPEED BOOST 3: Optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },

  // ✅ SPEED BOOST 4: Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ✅ SPEED BOOST 5: Reduce initial load
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig;