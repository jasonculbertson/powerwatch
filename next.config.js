/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com'],
  },
  webpack: (config, { isServer }) => {
    // Add node-loader for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Handle pdf-parse dependencies
    if (isServer) {
      config.externals.push({
        'canvas': 'commonjs canvas',
        'pdf-parse': 'commonjs pdf-parse'
      });
    }

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  }
};

module.exports = nextConfig;
