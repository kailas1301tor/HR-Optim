/** @type {import('next').NextConfig} */
const backendOrigin =
  (process.env.NEXT_PUBLIC_API_URL || 'https://roka-stage-backend.hroptim.com').replace(/\/+$/, '')

const nextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig
