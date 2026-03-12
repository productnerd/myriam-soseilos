import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-44 pb-24 px-6 md:px-20 lg:px-28">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
          404
        </p>
        <h1 className="text-display-lg mb-6">Page Not Found</h1>
        <p className="text-foreground/50 mb-10">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-xs tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
