import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const siteName = 'HK FITTERS';
const siteUrl = 'https://hk-fitters.vercel.app';

const defaultDescription =
  'HK FITTERS is a custom sportswear manufacturer and exporter offering OEM, private label, bulk production, custom designs, and worldwide sportswear manufacturing for brands, wholesalers, retailers, and businesses.';

const defaultImage =
  `${siteUrl}/logo/hk-logo-256.png`;

const pageMetadata = {
  '/': {
    title:
      'Custom Sportswear Manufacturer & Exporter | HK FITTERS',
    description:
      'HK FITTERS is a custom sportswear manufacturer and exporter providing OEM sportswear, private label manufacturing, bulk production, custom designs, and worldwide export solutions.',
    index: true,
  },

  '/shop': {
    title:
      'Sportswear Products | Custom Sportswear Manufacturer | HK FITTERS',
    description:
      'Explore sportswear and activewear products from HK FITTERS, including custom apparel for men, women, kids, brands, wholesalers, retailers, and bulk buyers.',
    index: true,
  },

  '/about': {
    title:
      'About HK FITTERS | Sportswear Manufacturer & Exporter',
    description:
      'Learn about HK FITTERS, a custom sportswear manufacturer and exporter providing OEM manufacturing, private label sportswear, bulk production, custom designs, and worldwide export services.',
    index: true,
  },

  '/contact': {
    title:
      'Contact HK FITTERS | Custom Sportswear Manufacturer',
    description:
      'Contact HK FITTERS for custom sportswear manufacturing, OEM production, private label sportswear, bulk orders, custom designs, and worldwide export inquiries.',
    index: true,
  },

  '/faq': {
    title:
      'Sportswear Manufacturing FAQ | HK FITTERS',
    description:
      'Find answers about HK FITTERS sportswear manufacturing, OEM, private label, custom designs, bulk orders, production, shipping, and international export services.',
    index: true,
  },

  '/men': {
    title:
      "Men's Sportswear Manufacturer | Custom & Wholesale | HK FITTERS",
    description:
      "HK FITTERS manufactures custom men's sportswear including singlets, rash guards, shorts, MMA shorts, T-shirts, and performance apparel for brands, wholesalers, retailers, and bulk buyers.",
    index: true,
  },

  '/women': {
    title:
      "Women's Sportswear Manufacturer | Custom & Wholesale | HK FITTERS",
    description:
      "HK FITTERS manufactures custom women's sportswear including singlets, rash guards, shorts, MMA shorts, T-shirts, and performance apparel for brands, wholesalers, retailers, and bulk buyers.",
    index: true,
  },

  '/kids': {
    title:
      "Kids' Sportswear Manufacturer | Custom & Wholesale | HK FITTERS",
    description:
      "HK FITTERS manufactures custom kids' sportswear including singlets, rash guards, shorts, MMA shorts, T-shirts, and performance apparel for brands, wholesalers, retailers, and bulk buyers.",
    index: true,
  },

  '/custom-sportswear-manufacturing': {
    title:
      'Custom Sportswear Manufacturing | HK FITTERS',
    description:
      'Custom sportswear manufacturing for brands and businesses. HK FITTERS provides custom designs, technical apparel production, bulk manufacturing, quality control, and worldwide export.',
    index: true,
  },

  '/oem-sportswear': {
    title:
      'Sportswear OEM Manufacturer | Custom OEM Production | HK FITTERS',
    description:
      'HK FITTERS provides OEM sportswear manufacturing for international brands, wholesalers, retailers, and businesses requiring custom apparel production and bulk manufacturing.',
    index: true,
  },

  '/private-label-sportswear': {
    title:
      'Private Label Sportswear Manufacturer | HK FITTERS',
    description:
      'Build your sportswear brand with HK FITTERS private label manufacturing, custom product development, bulk production, custom designs, and worldwide export solutions.',
    index: true,
  },

  '/bulk-sportswear': {
    title:
      'Bulk Sportswear Manufacturer & Wholesale Supplier | HK FITTERS',
    description:
      'Source bulk sportswear from HK FITTERS for brands, wholesalers, retailers, teams, and businesses seeking custom manufacturing, wholesale production, and international export.',
    index: true,
  },

  '/cart': {
    title: 'Shopping Cart | HK FITTERS',
    description:
      'Review selected HK FITTERS sportswear products before continuing with your order.',
    index: false,
  },

  '/wishlist': {
    title: 'Wishlist | HK FITTERS',
    description:
      'View your saved HK FITTERS sportswear and activewear products.',
    index: false,
  },

  '/checkout': {
    title: 'Checkout | HK FITTERS',
    description:
      'Complete your HK FITTERS sportswear order securely.',
    index: false,
  },

  '/login': {
    title: 'Login | HK FITTERS',
    description:
      'Log in to your HK FITTERS account.',
    index: false,
  },

  '/register': {
    title: 'Create an Account | HK FITTERS',
    description:
      'Create your HK FITTERS account to manage orders and profile details.',
    index: false,
  },

  '/profile': {
    title: 'Profile | HK FITTERS',
    description:
      'Manage your HK FITTERS profile and account details.',
    index: false,
  },

  '/track': {
    title: 'Track Order | HK FITTERS',
    description:
      'Track your HK FITTERS order and delivery status.',
    index: false,
  },
};

const normalizePath = (pathname) => {
  if (pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '') || '/';
};

const getProductMetadata = (pathname) => {
  if (!pathname.startsWith('/product/')) {
    return null;
  }

  return {
    title:
      'Custom Sportswear Product | HK FITTERS',

    description:
      'Explore custom sportswear products from HK FITTERS. View product details, sizes, colors, and request information about custom manufacturing, OEM, private label, bulk orders, and export services.',

    index: true,
  };
};

const setMetaTag = (
  attribute,
  value,
  content
) => {
  let tag = document.head.querySelector(
    `meta[${attribute}="${value}"]`
  );

  if (!tag) {
    tag = document.createElement('meta');

    tag.setAttribute(
      attribute,
      value
    );

    document.head.appendChild(tag);
  }

  tag.setAttribute(
    'content',
    content
  );
};

const setCanonical = (url) => {
  let canonicalTag =
    document.head.querySelector(
      'link[rel="canonical"]'
    );

  if (!canonicalTag) {
    canonicalTag =
      document.createElement('link');

    canonicalTag.setAttribute(
      'rel',
      'canonical'
    );

    document.head.appendChild(
      canonicalTag
    );
  }

  canonicalTag.setAttribute(
    'href',
    url
  );
};

const setStructuredData = (
  normalizedPath,
  metadata,
  canonicalUrl
) => {
  const existingSchema =
    document.head.querySelector(
      '#hk-fitters-seo-schema'
    );

  if (existingSchema) {
    existingSchema.remove();
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: metadata.title,
    description: metadata.description,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
  };

  if (normalizedPath === '/') {
    schema.mainEntity = {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: defaultImage,
      description: defaultDescription,
    };
  }

  if (normalizedPath === '/about') {
    schema.about = {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: defaultImage,
    };
  }

  const script =
    document.createElement('script');

  script.id =
    'hk-fitters-seo-schema';

  script.type =
    'application/ld+json';

  script.textContent =
    JSON.stringify(schema);

  document.head.appendChild(
    script
  );
};

function SeoHead() {
  const { pathname } =
    useLocation();

  useEffect(() => {
    const normalizedPath =
      normalizePath(pathname);

    const metadata =
      pageMetadata[normalizedPath] ||
      getProductMetadata(
        normalizedPath
      ) || {
        title:
          `${siteName} | Custom Sportswear Manufacturer & Exporter`,
        description:
          defaultDescription,
        index: true,
      };

    const canonicalUrl =
      `${siteUrl}${normalizedPath}`;

    /* =========================
       TITLE
       ========================= */

    document.title =
      metadata.title;


    /* =========================
       DESCRIPTION
       ========================= */

    setMetaTag(
      'name',
      'description',
      metadata.description
    );


    /* =========================
       ROBOTS
       ========================= */

    const robotsContent =
      metadata.index
        ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        : 'noindex, nofollow, noarchive';

    setMetaTag(
      'name',
      'robots',
      robotsContent
    );

    setMetaTag(
      'name',
      'googlebot',
      robotsContent
    );


    /* =========================
       CANONICAL
       ========================= */

    setCanonical(
      canonicalUrl
    );


    /* =========================
       OPEN GRAPH
       ========================= */

    setMetaTag(
      'property',
      'og:title',
      metadata.title
    );

    setMetaTag(
      'property',
      'og:description',
      metadata.description
    );

    setMetaTag(
      'property',
      'og:type',
      'website'
    );

    setMetaTag(
      'property',
      'og:url',
      canonicalUrl
    );

    setMetaTag(
      'property',
      'og:site_name',
      siteName
    );

    setMetaTag(
      'property',
      'og:locale',
      'en_US'
    );

    setMetaTag(
      'property',
      'og:image',
      defaultImage
    );

    setMetaTag(
      'property',
      'og:image:alt',
      `${siteName} - Custom Sportswear Manufacturer`
    );


    /* =========================
       TWITTER / X
       ========================= */

    setMetaTag(
      'name',
      'twitter:card',
      'summary_large_image'
    );

    setMetaTag(
      'name',
      'twitter:title',
      metadata.title
    );

    setMetaTag(
      'name',
      'twitter:description',
      metadata.description
    );

    setMetaTag(
      'name',
      'twitter:image',
      defaultImage
    );


    /* =========================
       STRUCTURED DATA
       ========================= */

    setStructuredData(
      normalizedPath,
      metadata,
      canonicalUrl
    );

  }, [pathname]);

  return null;
}

export default SeoHead;