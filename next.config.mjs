import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'glasgowairportexecutivetransfers.co.uk' }],
        destination: 'https://gec.limo/airport-transfers',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.glasgowairportexecutivetransfers.co.uk' }],
        destination: 'https://gec.limo/airport-transfers',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'scotlandexecutivetours.co.uk' }],
        destination: 'https://gec.limo/scotland-tours',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.scotlandexecutivetours.co.uk' }],
        destination: 'https://gec.limo/scotland-tours',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
