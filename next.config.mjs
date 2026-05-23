/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  async rewrites() {
    const backendUrl = process.env.API_BACKEND_URL

    if (!backendUrl) {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`
      }
    ]
  }
}

export default nextConfig
