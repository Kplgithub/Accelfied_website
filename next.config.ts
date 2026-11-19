import type { NextConfig } from "next";

const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Uploaded pictures are stored by the API and shown from this site's own address.
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` }];
  },
  cacheComponents: true,
  // Native PNG renderer for badge downloads; loaded from node_modules at runtime, not bundled.
  serverExternalPackages: ['@resvg/resvg-js'],
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
