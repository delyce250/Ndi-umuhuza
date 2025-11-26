/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', // or the host from the direct URL
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;