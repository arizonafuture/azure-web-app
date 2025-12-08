/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },

  swcMinify: true,

  compiler: {
    // Remove ALL console logs in production (log, warn, error, info, debug)
    removeConsole: process.env.NODE_ENV === "production" ? true : false,
  },
};

module.exports = nextConfig;
