export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Mining IME Roleplay",
  description:
    "Optimasi crafting dan kalkulasi resource untuk server IME RP. Hitung profit, waktu, dan kebutuhan semua item.",
  navItems: [
    { label: "Home", href: "/" },
    { label: "Calculator", href: "/calculator" },
    { label: "Item Info", href: "/info" },
    { label: "Trends", href: "/trends" },
    { label: "Custom Price", href: "/custom" },
  ],
  navMenuItems: [
    { label: "Home", href: "/" },
    { label: "Calculator", href: "/calculator" },
    { label: "Item Info", href: "/info" },
    { label: "Trends", href: "/trends" },
    { label: "Custom Price", href: "/custom" },
  ],
  links: {
    github: "https://github.com/ardelagi/mining-ime",
    discord: "https://discord.gg/imeroleplay",
  },
};
