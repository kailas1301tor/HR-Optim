/** @type {import('next').NextConfig} */
const backendOrigin =
  (process.env.NEXT_PUBLIC_API_URL || 'https://roka-prod-backend.hroptim.com').replace(/\/+$/, '')

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*/`,
      },
    ]
  },
}

export default nextConfig
