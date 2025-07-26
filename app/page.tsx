import { Hero } from "@/components/Hero";

import { Itenary } from "@/components/TripItenary";

import FAQAccordion from "@/components/FAQAccordian";
import { TripSummary } from "@/components/TripSummary";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TripSummary />
      <div id="itenary">
        <Itenary />
      </div>

      <div id="faq">
        <FAQAccordion />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </main>
  );
}
