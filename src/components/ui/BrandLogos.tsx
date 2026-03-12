/**
 * SVG wordmark logos for press features and award organizations.
 * Each logo is rendered as an inline SVG for crisp display on dark backgrounds.
 * Styled to be recognizable representations of each brand's typography.
 */

import { imageSrc } from "@/lib/image";

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
    <img src={imageSrc("/logos/london-fashion-week.png")} alt="London Fashion Week" className={className} />
  );
}

export function ParisFashionWeekLogo({ className = "" }: LogoProps) {
  return (
    <img src={imageSrc("/logos/paris-fashion-week.png")} alt="Paris Fashion Week" className={`${className} invert`} />
  );
}

export function MilanoFashionWeekLogo({ className = "" }: LogoProps) {
  return (
    <img src={imageSrc("/logos/milano-fashion-week.png")} alt="Milano Fashion Week" className={className} />
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

export function CountryTownHouseLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 320 60" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="160" y="22" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fontWeight="400" letterSpacing="3">COUNTRY &amp; TOWN</text>
      <text x="160" y="52" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="32" fontWeight="400" letterSpacing="4">HOUSE</text>
    </svg>
  );
}

export function VogueItaliaLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 128 32" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.0412 31.9988V23.503H48.5798V31.9988H47.0412Z" />
      <path d="M53.7226 24.857V31.9988H52.1839V24.857H50.324V23.5018H55.5714V24.857H53.7226Z" />
      <path d="M62.3906 31.9988L61.5979 30.0933H58.2228L57.419 31.9988H55.7659L59.7614 23.3184H60.1061L64.0561 31.9988H62.3906ZM59.9214 26.1089L58.6474 28.8993H61.1733L59.9214 26.1089Z" />
      <path d="M65.7646 23.503H67.3032V30.6448H70.2315V32H65.7646V23.503Z" />
      <path d="M71.9413 31.9988V23.503H73.4799V31.9988H71.9413Z" />
      <path d="M81.7467 31.9988L80.954 30.0933H77.5789L76.7751 31.9988H75.122L79.1175 23.3184H79.4622L83.4122 31.9988H81.7467ZM79.2775 26.1089L78.0035 28.8993H80.5294L79.2775 26.1089Z" />
      <path d="M100.742 12.1651L100.737 12.2833C100.652 14.1567 99.995 15.6597 98.7838 16.7502C96.642 18.6791 93.4872 18.5166 92.6723 18.5068C92.6637 18.5068 92.5308 18.5068 92.5234 18.5068V9.77836C92.5628 9.77836 92.7253 9.77836 92.7659 9.77713C94.2947 9.76729 96.0746 9.62942 96.3712 13.4465L96.3798 13.5597H96.674V5.60804H96.3835L96.3712 5.71759C95.9798 9.33893 94.1507 9.32416 92.66 9.32785C92.6551 9.32785 92.5271 9.32785 92.5234 9.32785V1.00566C92.7203 1.00443 93.0428 1.00196 93.241 0.998272C96.0524 0.95519 98.838 0.665926 100.023 6.64693L100.043 6.74663H100.342V0.541604H84.1815V0.96873H85.6118V14.0632C85.5774 15.944 84.8413 17.0986 84.195 17.7104C83.4146 18.4501 82.3216 18.8379 81.3332 18.8034C77.6872 18.6717 77.585 15.0048 77.5826 14.846V0.96873H79.2431V0.541604H72.7845V0.96873H74.4979L74.493 13.3123C74.493 16.6875 76.2077 19.2908 81.215 19.2908C84.5729 19.2908 86.114 16.5016 86.0796 14.1887V0.96873H87.6022V0.971192H89.408V18.5006H87.7782V18.9413H101.079V12.1651H100.742Z" />
      <path d="M67.1038 11.0671V11.4955H68.5908V15.3322C68.5883 18.1978 66.6878 18.8354 65.1972 18.8649C63.5884 18.8908 62.5101 18.103 61.8995 16.4671C61.2976 14.8719 60.9801 13.332 60.9801 9.74636C60.9801 8.4699 61.177 4.28357 62.1199 2.45198C62.4781 1.76143 63.1452 0.477594 65.1344 0.477594C65.1405 0.477594 65.1467 0.477594 65.1528 0.477594C67.5777 0.487441 68.9711 2.1664 70.1011 6.66785L70.1245 6.7614H70.399V0H70.1343L70.1023 0.0763165C69.8438 0.695465 69.2272 0.830865 68.6954 0.818556C68.4418 0.808709 68.2104 0.771782 68.0406 0.737316C67.8904 0.704081 67.7944 0.673309 67.7895 0.672078C67.5556 0.598223 67.3488 0.528061 67.1592 0.465285C67.0731 0.435743 66.9894 0.411124 66.9057 0.387737C66.2939 0.184637 65.8372 0.055391 65.1295 0.055391C61.9414 0.055391 57.5544 3.29515 57.5544 9.979C57.5544 15.4381 60.8336 19.2933 65.3092 19.2933C66.1425 19.2933 66.8306 19.02 67.478 18.7197C67.5987 18.6705 67.7181 18.62 67.8325 18.5658C68.4652 18.2655 69.0647 17.9812 69.7392 17.9455C69.7663 17.9442 69.7934 17.9442 69.8205 17.943C69.8389 17.943 69.8574 17.9418 69.8771 17.9418C70.2673 17.9418 71.0501 18.1941 71.2015 18.945L71.2212 19.0434L71.4834 19.0447V11.4979H72.8916V11.0696H67.1038V11.0671Z" />
      <path d="M48.0641 0.0947826C44.2827 0.0947826 40.1395 3.87368 40.1395 9.64296C40.1395 15.4122 44.4194 19.2416 48.0641 19.2416C51.7101 19.2416 55.9887 15.4122 55.9887 9.64296C55.9899 3.87368 51.8455 0.0947826 48.0641 0.0947826ZM52.4831 8.93396C52.4843 8.97581 52.4855 9.01766 52.4855 9.05828C52.4868 9.08905 52.4868 9.1186 52.4868 9.14937C52.4868 9.17276 52.488 9.19737 52.488 9.22076C52.488 9.25892 52.4892 9.29585 52.4892 9.33154C52.4892 9.34508 52.4892 9.35985 52.4892 9.37339C52.4892 9.41278 52.4905 9.44971 52.4905 9.48664C52.4905 9.49649 52.4905 9.50633 52.4905 9.51618C52.4905 9.56049 52.4905 9.60234 52.4905 9.64296C52.4905 9.67497 52.4905 9.70943 52.4905 9.74513C52.4855 10.8123 52.3957 14.9383 51.3149 16.9952C50.7056 18.1867 49.5006 18.8169 48.0641 18.8169C46.6276 18.8169 45.4226 18.1867 44.812 16.994C43.7313 14.9383 43.6414 10.8111 43.6365 9.74513C43.6365 9.70943 43.6365 9.67497 43.6365 9.64296C43.6365 9.60357 43.6365 9.56172 43.6365 9.51618C43.6365 9.50633 43.6365 9.49649 43.6365 9.48664C43.6365 9.44971 43.6365 9.41278 43.6377 9.37339C43.6377 9.35985 43.6377 9.34508 43.6377 9.33154C43.6377 9.29585 43.639 9.25892 43.639 9.22076C43.639 9.19737 43.6402 9.17276 43.6402 9.14937C43.6402 9.11983 43.6414 9.08905 43.6414 9.05828C43.6427 9.01766 43.6427 8.97581 43.6439 8.93396C43.6439 8.91919 43.6451 8.90442 43.6451 8.88965C43.687 7.24515 43.8925 4.15556 44.812 2.33997C45.558 0.835791 47.0486 0.520678 48.0653 0.520678C49.0808 0.520678 50.5715 0.837022 51.3162 2.34243C52.2357 4.15679 52.44 7.24638 52.4818 8.89088C52.4818 8.90442 52.4831 8.91919 52.4831 8.93396Z" />
      <path d="M38.1023 0.544061V0.966263H39.6077L35.5925 14.4017L30.7439 0.966263H32.1201V0.720081H32.1213V0.544061H26V0.966263H27.7725L34.5647 19.041H34.6619L40.0718 0.966263H41.7298V0.544061H38.1023Z" />
    </svg>
  );
}

export function VogueIndiaLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 201 86" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M199.543 32.75L199.531 33.066C199.305 38.074 197.555 42.094 194.332 45.008C188.625 50.164 180.227 49.727 178.059 49.703C178.035 49.703 177.68 49.703 177.664 49.703V26.375C177.77 26.375 178.199 26.375 178.309 26.367C182.379 26.344 187.117 25.977 187.906 36.176L187.926 36.477H188.711V15.227H187.941L187.906 15.52C186.863 25.199 181.996 25.16 178.027 25.168C178.012 25.168 177.672 25.168 177.664 25.168V2.926C178.188 2.922 179.047 2.914 179.574 2.906C187.059 2.793 194.473 2.02 197.629 18.004L197.68 18.273H198.48V1.684H155.453V2.828H159.262V37.824C159.168 42.852 157.211 45.938 155.492 47.57C153.41 49.547 150.5 50.586 147.871 50.496C138.164 50.141 137.891 40.344 137.887 39.914V2.828H142.305V1.684H125.109V2.828H129.672L129.66 35.82C129.66 44.84 134.227 51.797 147.559 51.797C156.496 51.797 160.598 44.344 160.508 38.16V2.828H164.559V2.836H169.367V49.684H165.031V50.863H200.441V32.75H199.543Z" />
      <path d="M109.988 29.816V30.965H113.949V41.215C113.938 48.875 108.879 50.578 104.91 50.656C100.633 50.727 97.758 48.625 96.133 44.254C94.527 39.984 93.688 35.871 93.688 26.285C93.688 22.875 94.211 11.688 96.719 6.793C97.672 4.949 99.449 1.516 104.746 1.516C104.762 1.516 104.777 1.516 104.793 1.516C111.246 1.539 114.961 6.031 117.969 18.059L118.031 18.313H118.758V0.238H118.059L117.969 0.441C117.285 2.098 115.641 2.461 114.227 2.426C113.551 2.398 112.938 2.301 112.48 2.207C112.082 2.121 111.828 2.039 111.816 2.031C111.191 1.836 110.641 1.648 110.137 1.484C109.906 1.406 109.684 1.336 109.461 1.273C107.832 0.734 106.617 0.387 104.73 0.387C96.242 0.387 84.566 9.043 84.566 26.91C84.566 41.5 93.293 51.805 105.211 51.805C107.426 51.805 109.258 51.074 110.984 50.27C111.305 50.137 111.625 50.004 111.93 49.859C113.613 49.055 115.207 48.297 117.004 48.199C117.074 48.195 117.148 48.195 117.219 48.195C117.273 48.195 117.32 48.191 117.371 48.191C118.41 48.191 120.496 48.863 120.898 50.875L120.949 51.137H121.648V30.969H125.398V29.824H109.988Z" />
      <path d="M59.301 0.492C49.234 0.492 38.203 10.594 38.203 26.012C38.203 41.43 49.594 51.664 59.301 51.664C69.008 51.664 80.395 41.43 80.395 26.012C80.398 10.594 69.363 0.492 59.301 0.492ZM71.066 24.117C71.066 24.227 71.07 24.34 71.07 24.449C71.074 24.531 71.074 24.609 71.074 24.695C71.074 24.754 71.078 24.82 71.078 24.883C71.078 24.984 71.078 25.082 71.078 25.18C71.078 25.219 71.078 25.258 71.078 25.293C71.078 25.395 71.082 25.496 71.082 25.594C71.082 25.617 71.082 25.645 71.082 25.672C71.082 25.789 71.082 25.902 71.082 26.012C71.082 26.098 71.082 26.191 71.082 26.285C71.07 29.137 70.828 40.164 67.957 45.66C66.332 48.848 63.121 50.531 59.301 50.531C55.477 50.531 52.266 48.848 50.641 45.656C47.766 40.164 47.523 29.137 47.512 26.285C47.512 26.191 47.512 26.098 47.512 26.012C47.512 25.906 47.512 25.793 47.512 25.672C47.512 25.645 47.512 25.617 47.512 25.594C47.512 25.496 47.512 25.395 47.516 25.293C47.516 25.258 47.516 25.219 47.516 25.18C47.516 25.082 47.52 24.984 47.52 24.883C47.52 24.82 47.52 24.754 47.52 24.695C47.52 24.613 47.523 24.531 47.523 24.449C47.527 24.34 47.527 24.227 47.531 24.117C47.531 24.078 47.531 24.039 47.531 23.996C47.645 19.602 48.191 11.344 50.641 6.492C52.629 2.473 56.598 1.633 59.301 1.633C62.004 1.633 65.977 2.473 67.957 6.5C70.406 11.348 70.949 19.605 71.063 24C71.063 24.039 71.066 24.078 71.066 24.117Z" />
      <path d="M32.781 1.691V2.824H36.785L26.098 38.73L13.188 2.824H16.852V2.164H16.855V1.691H0.559V2.824H5.277L23.359 51.129H23.621L38.023 2.824H42.438V1.691H32.781Z" />
      <path d="M61.145 85.34V63.043H65.168V85.34H61.145Z" />
      <path d="M89.441 85.762L76.207 70.785H76.086V85.34H72.309V62.625H73.453L86.715 77.535H86.84V63.043H90.59V85.762H89.441Z" />
      <path d="M104.957 85.34H97.73V63.043H104.691C107.785 63.043 111.715 63.59 114.328 67.082C115.828 69.098 116.516 71.512 116.516 74.164C116.512 80.637 112.703 85.34 104.957 85.34ZM110.902 69.07C109.734 67.656 107.871 66.602 104.957 66.602H101.746V81.785H104.926C109.969 81.785 112.492 78.801 112.492 74.227C112.492 72.328 111.984 70.484 110.902 69.07Z" />
      <path d="M122.723 85.34V63.043H126.746V85.34H122.723Z" />
      <path d="M149.402 85.34L147.336 80.336H138.512L136.406 85.34H132.086L142.531 62.559H143.43L153.754 85.34H149.402ZM142.949 69.883L139.621 77.203H146.223L142.949 69.883Z" />
    </svg>
  );
}

export function RetailJewellerLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 580 82" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.5,36.4H28c11.6,0,14.9-5.5,14.9-16.3C42.9,9,37.4,3.7,30.2,3.7c-6.3,0-6.7,0.7-6.7,3.9V36.4z M23.5,65.8c0,5.6,0.6,5.8,8.3,6.4v2.5H0v-2.5c7.9-0.3,8.3-0.8,8.3-6.4V10c0-5.7-0.7-5.9-8.3-6.5V1h35.3c14.2,0,23.5,4,23.5,18c0,9.9-6.9,16.2-18.5,17.4v0.9c11.1,2.8,15.1,8.3,17.4,19.2c2.8,12,3.7,15.3,10.5,15.7v2.5H60c-10.4,0-14.2-2.9-16.8-10.5C42,59.9,41,54,40.2,49.5c-1.5-8.9-4.7-10.4-12.3-10.4h-4.5V65.8z" />
      <path d="M91.1,47c2.4,0,3.2-0.9,3.2-3.6c0-6.2-1-14.5-7.7-14.5C79.5,29,78,39.9,78,47H91.1z M78,49.6c-0.1,11,3,20.7,13.1,20.7c7.1,0,11-3.2,14.1-9.9l1.7,0.8c-3.1,8.6-8.8,14.8-20,14.8c-17.4,0-22.5-10.9-22.5-24.7c0-13.6,6-24.8,22.8-24.8c18.3,0,20.1,12.8,20.1,19.5c0,2.6-1.4,3.6-4.9,3.6H78z" />
      <path d="M122,9.4h5v17.7h9.8v3.9H127v29.2c0,6.9,2.5,9.8,6.3,9.8c2.3,0,4-0.4,5.7-1.1l0.6,1.7c-5.4,3.9-10.8,5.3-15,5.3c-5.3,0-11.5-2.8-11.5-13V31.1h-5.9v-3.8c0,0,3.4-1.3,8.4-7.4C117.4,17.5,122,9.4,122,9.4z" />
      <path d="M166.6,46.8c-2.3,1.1-6.1,2.8-9.3,4.5c-3.6,1.6-4.9,4.1-4.9,8.7c0,5.8,2.8,10.8,7.8,10.8c2.5,0,6.4-1.4,6.4-7.1V46.8z M179.1,63.8c0,5.7,1,7,2.6,7.7c1.1,0.4,2.6,0.4,3.8,0.3v1.4c-3,1.7-6.5,2.8-11.3,2.8c-4.8,0-6.5-2.7-7.4-6.2c-3.4,2.2-7.7,6.2-13.8,6.2c-9.6,0-13.9-6.7-13.9-14c0-5.2,2.1-9.2,9.8-11.3c6.9-1.8,15.3-4.2,17.7-6.6v-5.9c0-6.3-2.7-9.3-6.7-9.3c-4,0-7.1,2.5-8.8,11.6c-0.5,2.1-1.7,3-3.8,3c-2.4,0-6.6-1.4-6.6-5.4c0-5.2,7.1-11.5,20.4-11.5c16.5,0,18.1,8,18.1,13.9V63.8z" />
      <path d="M194,38.1c0-4.2-0.8-5-2.8-5.3l-3.1-0.5v-2.1l19.5-3l0.5,0.3v39.3c0,4.8,0.4,5,6.6,5.4v2.4h-27v-2.4c5.9-0.3,6.4-0.7,6.4-5.4V38.1z" />
      <path d="M200.9,6.9c4.6,0,7.2,3.3,7.2,7.2c0,4-2.8,7.3-7.3,7.3c-4.6,0-7.2-3.3-7.2-7.3c0-3.9,2.7-7.2,7.2-7.2H200.9z" />
      <path d="M221.1,11.8c0-4.2-0.8-5.2-2.7-5.6l-3.7-0.6V3.5l20.3-2l0.1,0.1v65.3c0,4.7,0.4,4.9,6.6,5.4v2.5h-27.3v-2.5c6.1-0.3,6.6-0.7,6.6-5.4V11.8z" />
      <path d="M291.3,57.8c0,16.9-3,19.8-12.4,23.1c-5.6,2.1-14.3,0.8-19.3-0.9l0.4-1.1c2.8,0.5,7.4,1.2,11.3-0.8c2.8-1.4,4.8-3.4,4.8-18.1V8.8c0-5.2-0.2-6-8.4-6.4V0h31.6v2.5c-7.9,0.3-8,0.9-8,6.4V57.8z" />
      <path d="M322.1,47c2.5,0,3.2-0.9,3.2-3.6c0-6.2-1-14.5-7.7-14.5c-7.1,0-8.6,10.9-8.6,18.1H322.1z M309,49.6c-0.1,11,3,20.7,13.1,20.7c7.1,0,11-3.2,14.1-9.9l1.7,0.8c-3.1,8.6-8.8,14.8-20,14.8c-17.4,0-22.5-10.9-22.5-24.7c0-13.6,6-24.8,22.8-24.8c18.3,0,20.1,12.8,20.1,19.5c0,2.6-1.4,3.6-4.9,3.6H309z" />
      <path d="M360.2,27.5v2.2l-3.2,0.3c-2,0.1-2.5,0.9-1.8,3.1c2.4,8.5,6.4,22.5,8.7,30.5h0.3c0.6-2.4,8.1-33.3,8.7-35.8h8.6c3.1,9.9,8.6,26.4,11.8,35.8h0.3c2.8-9.8,6.5-25.2,7.5-30.2c0.4-2.3-0.2-2.9-1.8-3.1l-4.8-0.6v-2.2h17.8v2.2c-4.9,0.4-5.8,1-7.2,5.1c-2.5,6.9-8.1,25.3-12.4,39.7h-9.3c-2.3-8-8.4-26.4-10.7-33h-0.3c-0.6,2-7.7,30.8-8.3,33h-9.3c-4.2-13.4-8.2-27.8-12.6-40.6c-1.2-3.2-2-3.9-6.2-4.2v-2.2H360.2z" />
      <path d="M434.1,47c2.5,0,3.2-0.9,3.2-3.6c0-6.2-1-14.5-7.7-14.5c-7,0-8.6,10.9-8.6,18.1H434.1z M421,49.6c-0.1,11,3,20.7,13.1,20.7c7.1,0,11-3.2,14.1-9.9l1.7,0.8c-3.1,8.6-8.8,14.8-20,14.8c-17.4,0-22.5-10.9-22.5-24.7c0-13.6,6-24.8,22.8-24.8c18.3,0,20.1,12.8,20.1,19.5c0,2.6-1.4,3.6-4.9,3.6H421z" />
      <path d="M455.1,11.8c0-4.2-0.8-5.2-2.7-5.6l-3.7-0.6V3.5l20.3-2l0.1,0.1v65.3c0,4.7,0.5,4.9,6.6,5.4v2.5h-27.3v-2.5c6.1-0.3,6.6-0.7,6.6-5.4V11.8z" />
      <path d="M481,11.8c0-4.2-0.8-5.2-2.7-5.6l-3.7-0.6V3.5l20.3-2l0.1,0.1v65.3c0,4.7,0.4,4.9,6.6,5.4v2.5h-27.3v-2.5c6.1-0.3,6.6-0.7,6.6-5.4V11.8z" />
      <path d="M526,47c2.4,0,3.2-0.9,3.2-3.6c0-6.2-1-14.5-7.7-14.5c-7.1,0-8.6,10.9-8.6,18.1H526z M512.9,49.6c-0.1,11,3,20.7,13.1,20.7c7,0,11-3.2,14.1-9.9l1.7,0.8c-3.1,8.6-8.8,14.8-20,14.8c-17.4,0-22.5-10.9-22.5-24.7c0-13.6,6-24.8,22.8-24.8c18.3,0,20.1,12.8,20.1,19.5c0,2.6-1.4,3.6-4.9,3.6H512.9z" />
      <path d="M561.2,67.4c0,4.2,0.4,4.5,8,5v2.2h-26.9v-2.2c5.6-0.3,6-0.8,6-5V36.5c0-3.7-0.8-4.6-2.5-4.9l-3.1-0.4v-1.9l17-2.8l1.1,9.2c6-6.3,8.8-9.3,12.8-9.3c4.1,0,6.3,2.6,6.3,6.2c0,3.5-2.6,7.5-6.3,7.5c-1.5,0-2.7-0.7-3.6-1.5c-2-1.8-3.4-2.8-5.1-2.8c-2.3,0-3.8,2.3-3.8,7.8V67.4z" />
    </svg>
  );
}

export function YouYourWeddingLogo({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 300 50" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <text x="150" y="20" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fontWeight="400" fontStyle="italic" letterSpacing="1">you &amp; your</text>
      <text x="150" y="44" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="28" fontWeight="700" fontStyle="italic" letterSpacing="1">Wedding</text>
    </svg>
  );
}

// Map press feature names to logo components
export const pressLogoMap: Record<string, React.FC<LogoProps>> = {
  "Marie Claire": MarieClaireLogo,
  "Madame Figaro": MadameFigaroLogo,
  "Vogue Italia": VogueItaliaLogo,
  "Vogue India": VogueIndiaLogo,
  "Country & Town House": CountryTownHouseLogo,
  "Retail Jeweller": RetailJewellerLogo,
  "You & Your Wedding": YouYourWeddingLogo,
  "Selfridges": SelfridgesLogo,
  "TEDx": TedxLogo,
  "London Fashion Week": LondonFashionWeekLogo,
  "Paris Fashion Week": ParisFashionWeekLogo,
  "Milano Fashion Week": MilanoFashionWeekLogo,
};

// Map award organization names to logo components
export const awardLogoMap: Record<string, React.FC<LogoProps>> = {
  "National Association of Jewellers": NAJLogo,
  "International Trade & Export Awards": InternationalTradeAwardsLogo,
  "Madame Figaro International Award": MadameFigaroAwardLogo,
  "UK Watch & Jewellery Awards": UKJewelleryAwardsLogo,
  "London Jewellery Week": LondonJewelleryWeekLogo,
};
