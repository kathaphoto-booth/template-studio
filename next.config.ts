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
  // Vince-Alignment seam: when the static clone (katha-proposal-clone) proxies portal
  // pages under its own domain, emit absolute asset URLs so /_next/static/* loads from
  // the portal's own origin. Additive only — moves zero routes, so book.kathabooth.com
  // keeps serving every existing URL unchanged.
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://book.kathabooth.com' : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
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
    return [
      {
        source: '/template-design',
        destination: '/portal/guest/template-design',
      }
    ];
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
