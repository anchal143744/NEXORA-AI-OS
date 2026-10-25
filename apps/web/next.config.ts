import path from 'node:path';
import type { NextConfig } from 'next';

const internalApiBaseUrl = normalizeInternalApiBaseUrl(
  process.env.NEXORA_API_INTERNAL_URL ?? process.env.NEXT_PRIVATE_API_URL ?? 'http://localhost:4000',
);
const internalApiOrigin = new URL(internalApiBaseUrl).origin;
const publicApiBasePath = normalizePublicApiBasePath(process.env.NEXT_PUBLIC_API_URL ?? '/api');
const workspaceRoot = path.resolve(__dirname, '../..');
const testDistDir=process.env.NEXORA_E2E_WEB_DIST_DIR;
if(testDistDir&&(!/^\.next-e2e-[a-f0-9]{32}$/.test(testDistDir)||!process.env.NEXORA_TEST_CLUSTER_PATH||!process.env.NEXORA_RETAIL_TEST_DATABASE_URL))throw new Error('An isolated E2E build requires the disposable database runner.');

function normalizeInternalApiBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, '');
  const absolute = new URL(trimmed);
  return absolute.pathname.endsWith('/api') ? absolute.toString().replace(/\/$/, '') : absolute.origin + '/api';
}

function normalizePublicApiBasePath(value: string) {
  const trimmed = value.trim() || '/api';
  if (/^https?:\/\//i.test(trimmed)) return new URL(trimmed).pathname.replace(/\/$/, '') || '/api';
  return trimmed.startsWith('/') ? trimmed.replace(/\/$/, '') || '/api' : '/api';
}

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      process.env.NODE_ENV==='development'?"script-src 'self' 'unsafe-inline' 'unsafe-eval'":"script-src 'self' 'unsafe-inline'",
      "connect-src 'self' https: ws: wss:",
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  ...(testDistDir?{distDir:testDistDir}:{}),
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  compress: true,
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: workspaceRoot,
  outputFileTracingExcludes: {
    '*': [
      '**/*.bak',
      '**/*.bak.*',
      '**/*.tsbuildinfo',
      '**/.next/cache/**',
      '**/.next-e2e-*/**',
      '**/ops/refinement-backups/**',
    ],
  },
  transpilePackages: ['framer-motion', 'motion-dom', 'motion-utils'],
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: false,
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async rewrites() {
    return [
      { source: publicApiBasePath + '/docs', destination: internalApiOrigin + '/docs' },
      { source: publicApiBasePath + '/docs-json', destination: internalApiOrigin + '/docs-json' },
      { source: publicApiBasePath + '/:path*', destination: internalApiBaseUrl + '/:path*' },
      { source: '/docs-json', destination: internalApiOrigin + '/docs-json' },
      { source: '/docs/:path*', destination: internalApiOrigin + '/docs/:path*' },
      { source: '/swagger-ui/:path*', destination: internalApiOrigin + '/swagger-ui/:path*' },
      { source: '/v1/:path*', destination: internalApiBaseUrl + '/v1/:path*' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
