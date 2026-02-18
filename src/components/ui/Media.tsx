import Image from "next/image";

export type MediaItem = {
  src: string;
  alt: string;
  type?: "image" | "video" | "gif";
};

type Props = {
  item: MediaItem;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function Media({
  item,
  fill = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
}: Props) {
  const type = item.type || "image";

  if (type === "video") {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`object-cover w-full h-full rounded-lg ${className}`}
      >
        <source src={item.src} />
      </video>
    );
  }

  if (type === "gif") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.src}
        alt={item.alt}
        className={`object-cover w-full h-full rounded-lg ${className}`}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill={fill}
      className={`object-cover rounded-lg ${className}`}
      sizes={sizes}
      priority={priority}
    />
  );
}
