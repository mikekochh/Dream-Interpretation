/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/journal',
                permanent: true,
            },
        ]
    }
}

module.exports = nextConfig
