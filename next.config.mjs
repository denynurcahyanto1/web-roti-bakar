/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Drei menarik beberapa paket ESM yang lebih aman di-transpile eksplisit.
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['@react-three/drei', 'gsap'],
  },
};

export default nextConfig;
