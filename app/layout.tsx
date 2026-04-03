import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { GithubIcon, DiscordIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-8 px-6 flex-grow">
              {children}
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-separator mt-16">
              <div className="container mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: brand */}
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    Mining IME Roleplay
                  </span>
                  <span>·</span>
                  <span>Mining &amp; Crafting Optimizer</span>
                </div>

                {/* Right: links */}
                <div className="flex items-center gap-4">
                  <a
                    aria-label="GitHub"
                    className="text-muted hover:text-foreground transition-colors"
                    href={siteConfig.links.github}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <GithubIcon size={18} />
                  </a>
                  <a
                    aria-label="Discord"
                    className="text-muted hover:text-foreground transition-colors"
                    href={siteConfig.links.discord}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <DiscordIcon size={18} />
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
