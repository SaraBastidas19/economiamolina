import { Hero } from "@/components/home/hero";
import { PromoBanner } from "@/components/home/promo-banner";
import { isPromotionVisible } from "@/config/promotion";
import { ShopByAudience, ShopByType } from "@/components/home/shop-by";
import { NewArrivals, Promotions } from "@/components/home/product-sections";
import { Faq, FinalCta, HowToBuy, SizeGuide, WhyUs } from "@/components/home/info-sections";

export default async function HomePage() {
  const showPromotion = await isPromotionVisible();

  return (
    <>
      {showPromotion ? <PromoBanner /> : <Hero />}
      <ShopByAudience />
      <NewArrivals />
      <ShopByType />
      <Promotions />
      <WhyUs />
      <HowToBuy />
      <SizeGuide />
      <Faq />
      <FinalCta />
    </>
  );
}
