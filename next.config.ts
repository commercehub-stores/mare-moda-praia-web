import type { NextConfig } from "next";

/**
 * Multi-zones: /checkout belongs to the Checkout layer (repo mare-moda-praia-checkout, its own deploy with
 * basePath "/checkout"). The shopper stays on this domain, so the cart cookie (qs_cart) is shared.
 */
const CHECKOUT_ORIGIN = process.env.CHECKOUT_ORIGIN ?? "https://mare-moda-praia-checkout.vercel.app";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: "/checkout", destination: `${CHECKOUT_ORIGIN}/checkout` },
      { source: "/checkout/:path*", destination: `${CHECKOUT_ORIGIN}/checkout/:path*` },
    ];
  },
};

export default nextConfig;
