/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/myriam-soseilos",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "myriamsos.co.uk",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
