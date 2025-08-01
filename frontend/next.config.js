/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for Docker
    output: 'standalone',

    // API routes configuration
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.BACKEND_URL ?
                    `${process.env.BACKEND_URL}/api/:path*` :
                    'http://localhost:5245/api/:path*',
            },
        ];
    },

    // Environment variables
    env: {
        BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5245',
    },

    // External packages for server components
    serverExternalPackages: ['@radix-ui'],
};

module.exports = nextConfig;
