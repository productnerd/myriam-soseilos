"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const leftLinks = [
  { href: "/catalogue", label: "Collection" },
  { href: "/bespoke", label: "Bespoke" },
];

const rightLinks = [{ href: "/about", label: "About" }];

const allLinks = [
  ...leftLinks,
  ...rightLinks,
  { href: "mailto:info@myriamsos.co.uk?subject=Enquiry", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass =
    "text-xs tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300 delay-75";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="relative max-w-7xl mx-auto px-6 h-24 flex items-center">
          {/* Left nav links */}
          <div className="hidden md:flex items-center gap-8">
            {leftLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo — absolutely centered */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-lg tracking-[0.1em] text-foreground hover:opacity-60 transition-opacity duration-300 delay-75"
          >
            Myriam Soseilos
          </Link>

          {/* Right nav links */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            {rightLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:info@myriamsos.co.uk?subject=Enquiry"
              className={linkClass}
            >
              Contact
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 ml-auto"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px bg-foreground"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-px bg-foreground"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={
                menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="block w-6 h-px bg-foreground"
              transition={{ duration: 0.3 }}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-10"
          >
            {allLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              >
                {link.href.startsWith("mailto:") ? (
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-display-md text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-display-md text-foreground"
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
