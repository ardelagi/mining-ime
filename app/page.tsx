"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBoxOpen,
  faChartBar,
  faChartLine,
  faClock,
  faGem,
  faSlidersH,
} from "@fortawesome/free-solid-svg-icons";
import NextLink from "next/link";
import { Card, Chip, Button } from "@heroui/react";

import { title, subtitle } from "@/components/primitives";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const step = to / 40;
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) {
        setVal(to);
        clearInterval(t);
      } else {
        setVal(Math.floor(cur));
      }
    }, 30);

    return () => clearInterval(t);
  }, [to]);

  return (
    <>
      {val.toLocaleString()}
      {suffix}
    </>
  );
}

const features = [
  {
    icon: faBolt,
    title: "Crafting Optimizer",
    desc: "Input inventory kamu, sistem otomatis hitung kombinasi crafting paling profitable dengan algoritma greedy dan dependency chain.",
    badge: "Core Feature",
    href: "/calculator",
  },
  {
    icon: faChartBar,
    title: "Item Info & Analisis",
    desc: "Database lengkap semua item mining & perhiasan. Lihat requirement, cost, profit margin, dan rekomendasi prioritas crafting.",
    badge: "Database",
    href: "/info",
  },
  {
    icon: faSlidersH,
    title: "Custom Price",
    desc: "Sesuaikan harga setiap item sesuai kondisi market server. Kalkulasi jadi makin akurat dan relevan.",
    badge: "Personalized",
    href: "/custom",
  },
  {
    icon: faClock,
    title: "Time Estimation",
    desc: "Estimasi waktu produksi untuk setiap langkah crafting. Rencanakan sesi mining lebih efisien.",
    badge: "Planning",
    href: "/calculator",
  },
];

const steps = [
  {
    num: "01",
    icon: faBoxOpen,
    title: "Input Inventory",
    desc: "Masukkan jumlah ore, ingot, dan material yang kamu punya ke inventory calculator.",
  },
  {
    num: "02",
    icon: faBolt,
    title: "Jalankan Optimizer",
    desc: "Klik Hitung Optimasi dan biarkan algoritma mencari kombinasi crafting terbaik.",
  },
  {
    num: "03",
    icon: faChartLine,
    title: "Ikuti Langkah",
    desc: "Ikuti production steps yang dihasilkan, tandai setiap step yang sudah selesai.",
  },
  {
    num: "04",
    icon: faGem,
    title: "Maksimalkan Profit",
    desc: "Jual item hasil craft dan raih profit maksimal dari setiap sesi mining!",
  },
];

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-16 py-8 md:py-16">
      {/* Hero */}
      <div className="inline-block max-w-2xl text-center">
        <h1 className={title({ size: "lg" })}>Maximize Your&nbsp;</h1>
        <h1 className={title({ color: "green", size: "lg" })}>Mining Profit</h1>
        <p className={subtitle({ class: "mt-6 mx-auto" })}>
          Kalkulator crafting paling optimal untuk server IME Roleplay. Input
          inventory kamu, sistem otomatis temukan kombinasi terbaik untuk profit
          maksimal.
        </p>
        <div className="flex gap-4 items-center justify-center mt-8">
          <NextLink href="/calculator">
            <Button
              size="lg"
              variant="primary"
              className="font-semibold text-white px-8"
            >
              Mulai Hitung
            </Button>
          </NextLink>
        </div>
      </div>

      {/* Features */}
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <h2 className={title({ size: "sm" })}>Semua yang Kamu Butuhkan</h2>
          <p className={subtitle({ class: "mt-2 mx-auto max-w-md" })}>
            Toolkit lengkap untuk optimasi mining &amp; crafting di server IMERP
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <NextLink
              key={f.title}
              href={f.href}
              className="flex h-full block group outline-none"
            >
              <Card className="w-full h-full bg-surface/60 backdrop-blur-sm border border-separator hover:border-accent/40 group-hover:-translate-y-1 transition-all duration-300">
                <Card.Content className="gap-4 p-6">
                  <div className="w-12 h-12 rounded-xl border border-separator bg-surface secondary flex items-center justify-center text-primary text-xl">
                    <FontAwesomeIcon icon={f.icon} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">
                        {f.title}
                      </span>
                      <Chip
                        color="success"
                        size="sm"
                        variant="soft"
                        className="h-5 px-1 text-[10px]"
                      >
                        {f.badge}
                      </Chip>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </Card.Content>
              </Card>
            </NextLink>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <h2 className={title({ size: "sm" })}>Cara Kerja</h2>
          <p className={subtitle({ class: "mt-2 mx-auto max-w-sm" })}>
            4 langkah sederhana untuk profit maksimal
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <Card
              key={step.num}
              className="bg-surface/50 border border-separator/50 shadow-none"
            >
              <Card.Content className="p-6 flex flex-col gap-4">
                <div className="relative self-start">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl">
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-accent flex items-center justify-center text-accent text-xs font-bold shadow-lg">
                    {i + 1}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-md">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
