/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['ur', 'en'],
    defaultLocale: 'ur',
  },
};

module.exports = nextConfig;
