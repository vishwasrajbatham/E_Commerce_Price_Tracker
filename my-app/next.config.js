/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental : {
        serverActions : true,
        serverComponentsExternalPackages: ['mongoose']
    },
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'm.media-amazon.com',
              port: '',
              pathname: '/images/**',
            },
        ],
    },
}

module.exports = nextConfig
