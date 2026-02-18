import type { Metadata } from "next";
import { Inter, Cardo } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NebulaBackground } from "@/components/ui/NebulaBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cardo = Cardo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cardo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Myriam Soseilos | Fine Jewellery",
    template: "%s | Myriam Soseilos",
  },
  description:
    "Award-winning fine jewellery designer. Bold, unique designs inspired by architecture, space and the wearer themselves.",
  openGraph: {
    title: "Myriam Soseilos | Fine Jewellery",
    description: "Award-winning fine jewellery designer.",
    url: "https://myriamsos.co.uk",
    siteName: "Myriam Soseilos",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cardo.variable}`}>
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
