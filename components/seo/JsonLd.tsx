import { SERVICE_TIERS } from '@/lib/serviceTiers';

/**
 * Site-wide structured data (schema.org JSON-LD) for the Katha portal.
 *
 * Emits one `<script type="application/ld+json">` carrying an `@graph` with:
 *   1. LocalBusiness  — the studio, its service area and price band
 *   2. Service ×4     — one per canonical tier, priced from SERVICE_TIERS
 *   3. BreadcrumbList — the public route trail (Home → Inquire)
 *
 * Server component (no client hooks); rendered once in the root layout so the
 * graph is present on every route. Prices stay in sync with lib/serviceTiers.ts.
 */

const SITE_URL = 'https://book.kathabooth.com';

const PRICES = SERVICE_TIERS.map((t) => t.price);
const PRICE_LOW = Math.min(...PRICES);
const PRICE_HIGH = Math.max(...PRICES);

const localBusiness = {
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: 'Katha Booth',
  description:
    'Editorial DSLR portrait installations for weddings, celebrations, and corporate rooms across Southern California. Weathered oak and pearl-white hardware, studio strobe, archival cotton prints cut and dry the same night.',
  url: SITE_URL,
  image: `${SITE_URL}/products/editorial-installation.webp`,
  priceRange: `$${PRICE_LOW}–$${PRICE_HIGH}`,
  areaServed: [
    { '@type': 'City', name: 'Los Angeles' },
    { '@type': 'AdministrativeArea', name: 'Orange County' },
    { '@type': 'AdministrativeArea', name: 'Southern California' },
  ],
};

const services = SERVICE_TIERS.map((tier) => ({
  '@type': 'Service',
  '@id': `${SITE_URL}/#service-${tier.id}`,
  name: tier.name,
  description: tier.narrative,
  serviceType: 'Portrait installation',
  provider: { '@id': `${SITE_URL}/#business` },
  areaServed: { '@type': 'AdministrativeArea', name: 'Southern California' },
  offers: {
    '@type': 'Offer',
    price: String(tier.price),
    priceCurrency: 'USD',
  },
}));

const breadcrumbs = {
  '@type': 'BreadcrumbList',
  '@id': `${SITE_URL}/#breadcrumbs`,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Inquire',
      item: `${SITE_URL}/inquire`,
    },
  ],
};

const graph = {
  '@context': 'https://schema.org',
  '@graph': [localBusiness, ...services, breadcrumbs],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // schema.org graph is static and contains no user input — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
