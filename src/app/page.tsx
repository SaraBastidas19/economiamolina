import { Hero } from "@/components/home/hero";
import { ShopByAudience, ShopByType } from "@/components/home/shop-by";
import { NewArrivals, Promotions } from "@/components/home/product-sections";
import { Faq, FinalCta, HowToBuy, SizeGuide, WhyUs } from "@/components/home/info-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
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
