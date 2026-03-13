import {getTranslations} from 'next-intl/server';
import Hero from "@/components/pages/home/hero";
import HomeFeatures from "@/components/pages/home/features";
import HomeHowItWorks from "@/components/pages/home/how-it-works";
import HomeTestimonials from "@/components/pages/home/testimonials";
 
export async function generateMetadata({params}:{params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'HomePage'});
 
  return {
    title: t('title')
  };
}
export default function Home() {
  return (
    <main>
      <Hero/>
      <HomeFeatures />
      <HomeHowItWorks />
      <HomeTestimonials />
    </main>
  );
}
