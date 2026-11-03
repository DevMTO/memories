// Datos estructurados (schema.org) para <JsonLd> (kit/site). Las URLs van
// absolutas; `site` es Astro.site.

export const SITE_NAME = 'Memories Travel Perú';

type Site = URL | string;
const abs = (path: string | undefined, site: Site) => (path ? new URL(path, site).href : undefined);
const organizationId = (site: Site) => new URL('/#organization', site).href;

// Nombre del sitio (la línea sobre la URL en Google). Solo en la portada.
export function website(site: Site) {
  return {
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['Memories Travel Peru', 'Memories Travel'],
    url: new URL('/', site).href,
    publisher: { '@id': organizationId(site) },
  };
}

type Contact = { email: string; whatsappDisplay: string; address: string };

// La empresa, con el contacto de /admin.
export function organization(contact: Contact, site: Site, image?: string) {
  return {
    '@type': 'TravelAgency',
    '@id': organizationId(site),
    name: SITE_NAME,
    url: new URL('/', site).href,
    logo: abs('/images/IMAGOTIPO-MEMORIES-TRAVEL-5.png', site),
    image: abs(image, site),
    email: contact.email || undefined,
    telephone: contact.whatsappDisplay || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address || undefined,
      addressLocality: 'Cusco',
      addressRegion: 'Cusco',
      addressCountry: 'PE',
    },
  };
}

export type Crumb = { name: string; href: string };

export function breadcrumbs(items: Crumb[], site: Site) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, href }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: abs(href, site),
    })),
  };
}

type Trip = { title: string; price?: number; imageUrl?: string };

// Un tour, trekking o paquete. Los precios del sitio son en dólares.
export function trip(product: Trip, description: string | undefined, url: string, site: Site) {
  return {
    '@type': 'TouristTrip',
    name: product.title,
    description,
    image: abs(product.imageUrl, site),
    url,
    provider: { '@id': organizationId(site) },
    offers: product.price
      ? { '@type': 'Offer', price: product.price, priceCurrency: 'USD', url }
      : undefined,
  };
}

type Destination = { name: string; imageUrl?: string };

export function destination(dest: Destination, description: string | undefined, url: string, site: Site) {
  return {
    '@type': 'TouristDestination',
    name: dest.name,
    description,
    image: abs(dest.imageUrl, site),
    url,
    containedInPlace: { '@type': 'Country', name: 'Peru' },
  };
}
