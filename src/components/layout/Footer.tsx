import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-xl text-foreground">
              Myriam Soseilos
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Award-winning fine jewellery designer.
              <br />
              Bold, unique designs inspired by architecture,
              <br />
              space and the wearer themselves.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/catalogue"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                Collection
              </Link>
              <Link
                href="/about"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                About Myriam
              </Link>
              <a
                href="mailto:info@myriamsos.co.uk?subject=Enquiry"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted mb-4">
              Get in Touch
            </h4>
            <a
              href="mailto:info@myriamsos.co.uk"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
            >
              info@myriamsos.co.uk
            </a>
            <div className="flex gap-6 mt-6">
              <a
                href="https://www.instagram.com/myriamsoseilos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.15em] uppercase text-muted hover:text-foreground transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/myriamsoseilos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.15em] uppercase text-muted hover:text-foreground transition-colors duration-300"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Myriam Soseilos. All rights
            reserved.
          </p>
          <Link
            href="/privacy"
            className="text-xs text-muted hover:text-foreground transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
