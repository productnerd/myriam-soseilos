import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NebulaBackground } from "@/components/ui/NebulaBackground";
import "./globals.css";

const montserrat = localFont({
  src: [
    { path: "../../public/fonts/Montserrat-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Montserrat-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../../public/fonts/Montserrat-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Montserrat-Italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/Montserrat-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Montserrat-SemiBoldItalic.otf", weight: "600", style: "italic" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

const BASE_URL = "https://productnerd.github.io/myriam-soseilos";

export const metadata: Metadata = {
  title: {
    default: "MS / audaciously different jewellery",
    template: "%s | Myriam Soseilos",
  },
  description:
    "Audaciously different fine jewellery. Bold, unconventional designs inspired by architecture, space and the wearer themselves.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Myriam Soseilos | Audaciously Different Jewellery",
    description: "Audaciously different fine jewellery.",
    url: BASE_URL,
    siteName: "Myriam Soseilos",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/hero.jpg`,
        width: 2624,
        height: 1824,
        alt: "Myriam Soseilos jewellery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myriam Soseilos | Audaciously Different Jewellery",
    description: "Audaciously different fine jewellery.",
    images: [`${BASE_URL}/hero.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans text-foreground antialiased">
        <NebulaBackground />
        {/* Noise grain overlay — fixed, covers entire viewport */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />
        <CustomCursor />
        <div className="relative z-[2]">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
