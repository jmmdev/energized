const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/xapi/:path*",
          destination: "https://energized.vercel.app/api/:path*"
        }
      ]
    },
    images: {
      remotePatterns: [
        {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
        },
        {
          protocol: "https",
          hostname: "fastly.picsum.photos",
        },
        {
          protocol: "https",
          hostname: "assets.tcgdex.net",
        }
      ],
      
    },
    reactStrictMode: false,
  }
  
  module.exports = nextConfig