/** Prepend basePath for local image sources (Next.js unoptimized images don't do this automatically). */
const BASE_PATH = process.env.NODE_ENV === "production" ? "/myriam-soseilos" : "";

export function imageSrc(src: string): string {
  if (!BASE_PATH || src.startsWith("http") || src.startsWith(BASE_PATH))
    return src;
  return `${BASE_PATH}${src}`;
}
