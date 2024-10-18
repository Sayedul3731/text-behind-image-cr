/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lxlfwrdbdhafahrrgtzk.supabase.co",
      },
    ],
    domains: ["i.ibb.co.com"],
  },
};

export default nextConfig;
