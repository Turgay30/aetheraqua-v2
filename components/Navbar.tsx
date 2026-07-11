"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/apollo", label: "Apollo" },
  { href: "/helios", label: "Helios" },
  { href: "/akvaryum-asistani", label: "Akvaryum Asistanı" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-abyss/80 backdrop-blur-md border-b border-abyss-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <TridentMark />
          <span className="font-display text-xl tracking-[0.18em] text-ink">
            AETHER<span className="text-aqua">AQUA</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative font-body text-sm text-ink-muted transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-aqua after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/sepet"
          aria-label="Sepet"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-abyss-border text-ink-muted transition-colors hover:border-aqua hover:text-aqua"
        >
          <CartIcon />
        </Link>
      </nav>
    </header>
  );
}

function TridentMark() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-aqua"
    >
      <path
        d="M11 3V23M11 3C11 3 6.5 3 6.5 7C6.5 9 8 10 8 10M11 3C11 3 15.5 3 15.5 7C15.5 9 14 10 14 10M4 2C4 2 4.5 5.5 7 7M18 2C18 2 17.5 5.5 15 7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 23C6 23 8 21.5 11 21.5C14 21.5 16 23 16 23"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.5 5h11M10 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
