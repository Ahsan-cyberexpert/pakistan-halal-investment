import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['ur', 'en'],
    defaultLocale: 'ur',
  },
};

export default nextConfig;
