'use client';

import { NewPortfolioPageLayout } from './NewPortfolioPageLayout';

export const PortfolioClient = () => {
  return (
    <NewPortfolioPageLayout
      pgName="Sunrise PG"
      location="No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034"
      tagline="Your home away from home in Koramangala"
      price="₹15,000"
      images={[]}
    />
  );
};

// Default export for dynamic imports
export default PortfolioClient;
