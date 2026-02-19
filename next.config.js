/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), { 'xlsx': 'xlsx' }];
    return config;
  },
};

module.exports = nextConfig;