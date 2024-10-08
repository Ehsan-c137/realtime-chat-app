import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
   compiler: {
      removeConsole: process.env.NODE_ENV !== "development",
   },
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
            port: "",
            pathname: "/**",
         },
      ],
   },
};

export default withPWA({
   dest: "public",
   // disable: process.env.NODE_ENV === "development",
   register: true,
   skipWaiting: true,
})(nextConfig);
