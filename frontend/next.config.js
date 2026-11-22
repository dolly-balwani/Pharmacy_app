/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['localhost'] },
  env: { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000' },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*',
      },
    ];
  },
};
module.exports = nextConfig;

