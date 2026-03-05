/** Prepend basePath for local image sources (Next.js unoptimized images don't do this automatically). */
const BASE_PATH = "/myriam-soseilos";

export function imageSrc(src: string): string {
  if (src.startsWith("http") || src.startsWith(BASE_PATH)) return src;
  return `${BASE_PATH}${src}`;
}
