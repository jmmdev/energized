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
  }
  
  module.exports = nextConfig