"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <NextLink className="flex items-center gap-2.5" href="/">
            <Image
              alt="IME Mining Logo"
              className="rounded-md"
              height={28}
              src="/android-chrome-192x192.png"
              width={28}
            />
            <span className="font-bold text-foreground">
              Crafting Calculator
            </span>
          </NextLink>

          {/* Desktop nav */}
          <ul className="hidden lg:flex gap-1 ml-4 py-2">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-transparent",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "text-muted hover:text-foreground hover:bg-surface",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeSwitch />

          {/* Mobile hamburger */}
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-separator bg-background/95 backdrop-blur-lg absolute w-full left-0">
          <ul className="flex flex-col gap-1 p-3">
            {siteConfig.navMenuItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    "flex px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-transparent",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "text-muted hover:text-foreground hover:bg-surface",
                  )}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
