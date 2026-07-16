import type {NextConfig} from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://kathabooth.com https://*.kathabooth.com https://*.squarespace.com" },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  // Vince-Alignment seam: Removed absolute assetPrefix since the clone and studio
  // are being unified under a single Next.js Vercel deployment.
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://book.kathabooth.com' : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // One year: portfolio assets are content-hashed by filename convention.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    const list = [
      { source: '/(.*)', headers: securityHeaders },
    ];
    if (isProd) {
      list.push(
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/fonts/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        }
      );
    }
    return list;
  },
  async rewrites() {
    // NOTE: no '/' rewrite — the root is app/page.tsx, which forwards query
    // params and redirects to /gallery (the public front door).
    return [
      {
        source: '/template-design',
        destination: '/portal/guest/template-design',
      },
      {
        source: '/book',
        destination: '/inquire',
      }
    ];
  },
  // The legacy /reserve flow is consolidated into the gallery's Vault Drawer.
  // Query strings (?tier=, ?lead=) are preserved through the redirect.
  async redirects() {
    return [{ source: '/reserve', destination: '/gallery', permanent: true }];
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default analyzer(nextConfig);
