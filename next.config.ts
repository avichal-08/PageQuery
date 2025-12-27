/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdfjs-dist"], //  Prevents bundling errors
  },
  // If you added the serverActions body size limit earlier, keep it:
  /*
  experimental: {
     serverActions: {
       bodySizeLimit: "10mb",
     },
     serverComponentsExternalPackages: ["pdfjs-dist"],
  },
  */
};

export default nextConfig;