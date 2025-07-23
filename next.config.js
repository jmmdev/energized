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
        }
      ],
      
    },
  }
  
  module.exports = nextConfig