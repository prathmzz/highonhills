import "./globals.css";
import Footer from "@/components/Footer";
import FewSeatsBannerProvider from "@/components/FewSeatsBannerProvider";

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
        <FewSeatsBannerProvider>
          <div>{children}</div>
        </FewSeatsBannerProvider>
        <Footer />
      </body>
    </html>
  );
}
