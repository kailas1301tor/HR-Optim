import fs from 'fs'
import path from 'path'

/** @type {import('next').NextConfig} */

const configPath = path.resolve(process.cwd(), 'lib/backend-config.json')
const backendConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

const backendOrigin =
  (process.env.NEXT_PUBLIC_API_URL || backendConfig.defaultBackendUrl).replace(/\/+$/, '')

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/hrms/:path*',
        destination: `${backendOrigin}/api/:path*/`,
      },
    ]
  },
}

export default nextConfig
