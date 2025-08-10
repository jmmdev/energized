const { hostname } = require("os")

const nextConfig = {
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
    env: {
      AUTH_SECRET: process.env.AUTH_SECRET,
    }
  }
  
  module.exports = nextConfig