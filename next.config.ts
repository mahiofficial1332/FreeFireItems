import type {NextConfig} from 'next';

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'placehold.co',
  },
  {
    protocol: 'https',
    hostname: 'firebasestorage.googleapis.com',
  }
];

// Dynamically add hostnames from environment variables for secure image loading
if (process.env.NEXT_PUBLIC_IMAGE_API_PRIMARY) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_IMAGE_API_PRIMARY);
    remotePatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
    });
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_IMAGE_API_PRIMARY URL:', error);
  }
}

if (process.env.NEXT_PUBLIC_IMAGE_API_FALLBACK) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_IMAGE_API_FALLBACK);
    remotePatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
    });
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_IMAGE_API_FALLBACK URL:', error);
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
