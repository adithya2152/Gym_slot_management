 import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js config
  reactStrictMode: false,
  swcMinify: false,
};

export default withPWA({
  // PWA plugin config
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
