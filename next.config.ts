import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // The site lives on www. Visits to the bare domain get a permanent (308) redirect to the same path on www,
  // so search engines index one host only. Needs the reverse proxy to pass the original Host header.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'accelfied.com' }],
        destination: 'https://www.accelfied.com/:path*',
        permanent: true,
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
