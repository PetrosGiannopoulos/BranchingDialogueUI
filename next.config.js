/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/download',
  //       destination: '/api/download.js'
  //     },
  //   ]
  // },
}

module.exports = nextConfig
