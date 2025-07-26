import { NavbarDemo } from "@/components/navbar";
import "./globals.css";
import { StickyBanner } from "@/components/ui/sticky-banner";
import Footer from "@/components/Footer";


export const metadata = {
  title: "Trip 2025",
  description: "Final Year Himachal Trip Registration Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <StickyBanner className="bg-gradient-to-b from-red-500 to-red-600">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          Early Bird Offer ending soon {" "}
          <a href="#" className="transition duration-200 hover:underline">
            Book your seats now !
          </a>
        </p>
      </StickyBanner>
        <NavbarDemo />
        <div >{children}</div>
        <Footer />
      </body>
    </html>
  );
}
