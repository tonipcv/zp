/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minios3-minio.dpbdp1.easypanel.host',
        port: '',
        pathname: '/katsu/news/**',
      },
    ],
    domains: ['www.facebook.com'],
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    serverExternalPackages: ['@prisma/client'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
}

module.exports = nextConfig 