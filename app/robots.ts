import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/portal/'],
    },
    sitemap: 'https://book.kathabooth.com/sitemap.xml',
  };
}
