import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const siteName = 'HK Fitters';
const defaultDescription = 'HK FITTERS is a premium sportswear and activewear manufacturer delivering high-quality performance wear, custom gym wear, and reliable global manufacturing solutions for brands, retailers, and businesses worldwide.';

const pageMetadata = {
  '/': {
    title: 'HK Fitters | Sportswear & Activewear Manufacturer',
    description: defaultDescription,
  },
  '/shop': {
    title: 'Shop Sportswear | HK Fitters',
    description: 'Explore premium sportswear, activewear, and performance apparel from HK FITTERS for modern athletes, brands, and businesses.',
  },
  '/about': {
    title: 'About HK Fitters | Premium Sportswear',
    description: 'Learn about HK FITTERS, a premium international sportswear company serving modern performance culture and global export partners.',
  },
  '/contact': {
    title: 'Contact HK Fitters | Sportswear Export Inquiry',
    description: 'Contact HK FITTERS for sportswear, activewear, OEM, private label, bulk order, and worldwide shipping inquiries.',
  },
  '/faq': {
    title: 'FAQ | HK Fitters Sportswear',
    description: 'Find answers about HK FITTERS sportswear, international shipping, orders, OEM, private label, and export partnerships.',
  },
  '/cart': {
    title: 'Shopping Cart | HK Fitters',
    description: 'Review selected HK FITTERS sportswear and continue to checkout.',
  },
  '/wishlist': {
    title: 'Wishlist | HK Fitters',
    description: 'View your saved HK FITTERS sportswear and activewear products.',
  },
  '/checkout': {
    title: 'Checkout | HK Fitters',
    description: 'Complete your HK FITTERS sportswear order securely.',
  },
  '/login': {
    title: 'Login | HK Fitters',
    description: 'Log in to your HK FITTERS account.',
  },
  '/register': {
    title: 'Create an Account | HK Fitters',
    description: 'Create your HK FITTERS account to manage sportswear orders and profile details.',
  },
  '/profile': {
    title: 'Profile | HK Fitters',
    description: 'Manage your HK FITTERS profile and account details.',
  },
  '/track': {
    title: 'Track Order | HK Fitters',
    description: 'Track your HK FITTERS order and delivery status.',
  },
};

const normalizePath = (pathname) => {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
};

function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = normalizePath(pathname);
    const isProductPage = normalizedPath.startsWith('/product/');
    const canonicalPath = isProductPage ? normalizedPath : normalizedPath === '/shop' ? '/shop' : normalizedPath;
    const metadata = pageMetadata[normalizedPath] || (isProductPage
      ? {
          title: `Product | ${siteName}`,
          description: 'Explore product details from HK FITTERS premium sportswear and activewear collections.',
        }
      : {
          title: `${siteName} | Sportswear & Activewear`,
          description: defaultDescription,
        });
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;

    document.title = metadata.title;

    let descriptionTag = document.head.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', metadata.description);

    let canonicalTag = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);
  }, [pathname]);

  return null;
}

export default SeoHead;
