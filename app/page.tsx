import { Hero } from '@/components/sections/Hero';
import { MenuSection } from '@/components/sections/MenuSection';
import { StorySection } from '@/components/sections/StorySection';
import { LocationSection } from '@/components/sections/LocationSection';
import { MenuModal } from '@/components/sections/MenuModal';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MenuSection />
      <StorySection />
      <LocationSection />
      <MenuModal />
    </>
  );
}
