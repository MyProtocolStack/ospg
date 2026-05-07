"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/vigil", label: "VIGIL" },
  { href: "/grants", label: "Grants" },
  { href: "/courses", label: "Courses" },
  { href: "/blog", label: "Insights" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(10, 22, 40, 0)", "rgba(6, 14, 27, 0.85)"]
  );
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.15]);
  const padding = useTransform(scrollY, [0, 80], ["20px", "12px"]);

  const [open, setOpen] = useState(false);

  return (
    <motion.header
      style={{
        background: bg,
        borderBottom: "1px solid",
        borderColor: useTransform(
          borderOpacity,
          (v) => `rgba(201, 169, 97, ${v})`
        ),
        backdropFilter: "blur(12px)",
        paddingTop: padding,
        paddingBottom: padding,
      }}
      className="fixed top-0 inset-x-0 z-50 transition-colors"
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Shield
              className="h-7 w-7 text-[var(--color-gold-400)] transition-transform group-hover:rotate-3"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-[var(--color-gold-400)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base text-[var(--color-cream)] tracking-tight">
              {BRAND.shortName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-300)]">
              Protection Group
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-[14px] text-[var(--color-silver-100)] hover:text-[var(--color-cream)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14px] text-[var(--color-silver-200)] hover:text-[var(--color-gold-400)] transition-colors"
          >
            Sign In
          </Link>
          <Link href="/walkthrough" className="btn-primary !py-2.5 !px-5 !text-sm">
            Book Walkthrough
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-[var(--color-cream)]"
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mt-3 mx-6 surface-card p-6 space-y-4"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-[var(--color-cream)] text-[15px]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="btn-secondary w-full justify-center"
            >
              Sign In
            </Link>
            <Link
              href="/walkthrough"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Book Walkthrough
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
