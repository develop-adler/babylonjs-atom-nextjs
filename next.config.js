/** @type {import('next').NextConfig} */


/**
 * INFO: i18n for multiple language and SEO
 */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
    reactStrictMode: false,
    i18n,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
}

module.exports = nextConfig
