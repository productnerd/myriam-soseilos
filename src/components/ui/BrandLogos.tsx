/**
 * SVG wordmark logos for press features and award organizations.
 * Each logo is rendered as an inline SVG for crisp display on dark backgrounds.
 * Styled to be recognizable representations of each brand's typography.
 */

type LogoProps = {
  className?: string;
};

export function VogueLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 200 40" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="32" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="38" fontWeight="400" letterSpacing="6">VOGUE</text>
    </svg>
  );
}

export function MarieClaireLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 260 40" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="130" y="30" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="28" fontWeight="400" letterSpacing="3">marie claire</text>
    </svg>
  );
}

export function MadameFigaroLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 300 44" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="150" y="20" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="18" fontWeight="700" letterSpacing="5">MADAME</text>
      <text x="150" y="40" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="22" fontWeight="400" fontStyle="italic" letterSpacing="3">FIGARO</text>
    </svg>
  );
}

export function SelfridgesLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 280 36" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="140" y="28" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="24" fontWeight="700" letterSpacing="8">SELFRIDGES</text>
    </svg>
  );
}

export function TedxLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 160 44" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="36" fontFamily="Helvetica, Arial, sans-serif" fontSize="40" fontWeight="900" letterSpacing="-1" fill="#eb0028">TED</text>
      <text x="96" y="36" fontFamily="Helvetica, Arial, sans-serif" fontSize="24" fontWeight="400" letterSpacing="0" fill="currentColor" dy="2">x</text>
    </svg>
  );
}

export function LondonFashionWeekLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 200 44" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="18" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="300" letterSpacing="4">LONDON</text>
      <text x="100" y="38" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fontWeight="400" letterSpacing="2">Fashion Week</text>
    </svg>
  );
}

export function ParisFashionWeekLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 200 44" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="18" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="300" letterSpacing="4">PARIS</text>
      <text x="100" y="38" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fontWeight="400" letterSpacing="2">Fashion Week</text>
    </svg>
  );
}

export function ShanghaiFashionWeekLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 200 44" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="18" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="300" letterSpacing="4">SHANGHAI</text>
      <text x="100" y="38" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fontWeight="400" letterSpacing="2">Fashion Week</text>
    </svg>
  );
}

export function NAJLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 180 48" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="90" y="22" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="24" fontWeight="700" letterSpacing="8">NAJ</text>
      <text x="90" y="40" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="7" fontWeight="300" letterSpacing="1.5">NATIONAL ASSOCIATION OF JEWELLERS</text>
    </svg>
  );
}

export function UKJewelleryAwardsLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 220 48" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="110" y="18" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="300" letterSpacing="3">UK WATCH &amp; JEWELLERY</text>
      <text x="110" y="38" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="18" fontWeight="400" letterSpacing="4">AWARDS</text>
    </svg>
  );
}

export function LondonJewelleryWeekLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 220 48" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="110" y="18" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="300" letterSpacing="3">LONDON</text>
      <text x="110" y="38" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fontWeight="400" letterSpacing="2">Jewellery Week</text>
    </svg>
  );
}

export function InternationalTradeAwardsLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 240 48" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="120" y="18" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="9" fontWeight="300" letterSpacing="2">INTERNATIONAL TRADE &amp; EXPORT</text>
      <text x="120" y="38" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="18" fontWeight="400" letterSpacing="4">AWARDS</text>
    </svg>
  );
}

export function MadameFigaroAwardLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 260 48" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="130" y="18" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fontWeight="700" letterSpacing="3">MADAME FIGARO</text>
      <text x="130" y="38" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="300" letterSpacing="3">INTERNATIONAL AWARD</text>
    </svg>
  );
}

// Map press feature names to logo components
export const pressLogoMap: Record<string, React.FC<LogoProps>> = {
  "Vogue UK": VogueLogo,
  "Marie Claire": MarieClaireLogo,
  "Madame Figaro": MadameFigaroLogo,
  "Selfridges": SelfridgesLogo,
  "TEDx": TedxLogo,
  "London Fashion Week": LondonFashionWeekLogo,
  "Paris Fashion Week": ParisFashionWeekLogo,
  "Shanghai Fashion Week": ShanghaiFashionWeekLogo,
};

// Map award organization names to logo components
export const awardLogoMap: Record<string, React.FC<LogoProps>> = {
  "National Association of Jewellers": NAJLogo,
  "International Trade & Export Awards": InternationalTradeAwardsLogo,
  "Madame Figaro International Award": MadameFigaroAwardLogo,
  "UK Watch & Jewellery Awards": UKJewelleryAwardsLogo,
  "London Jewellery Week": LondonJewelleryWeekLogo,
};
