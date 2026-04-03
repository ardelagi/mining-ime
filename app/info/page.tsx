"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input, Chip, Card } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBoxOpen,
  faCalculator,
  faChartLine,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faFilter,
  faFire,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import miningData from "@/data/mining.json";
import { MiningData } from "@/types/game";
import { title } from "@/components/primitives";

type Tier = "topPriority" | "recommended" | "lowProfit" | "none";
type TierFilter = "all" | Tier;

const fmt = (n: string) =>
  n.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const BASE = [
  "gold_ring",
  "silver_ring",
  "gold_chain",
  "silver_chain",
  "gold_earring",
  "silver_earring",
];

const isBase = (n: string) => BASE.includes(n);

const CATS = [
  { key: "all", label: "Semua" },
  { key: "raw", label: "Raw" },
  { key: "ingots", label: "Ingots" },
  { key: "gems", label: "Gems" },
  { key: "base", label: "Base" },
  { key: "rings", label: "Rings" },
  { key: "earrings", label: "Earrings" },
  { key: "necklaces", label: "Necklaces" },
];

const TIER_OPTIONS = [
  { value: "all", label: "Semua Tier" },
  { value: "topPriority", label: "Prioritas Utama" },
  { value: "recommended", label: "Direkomendasikan" },
  { value: "lowProfit", label: "Profit Rendah" },
];

export default function InfoPage() {
  const [data, setData] = useState<MiningData>(miningData as MiningData);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [tier, setTier] = useState<TierFilter>("all");
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    const saved = localStorage.getItem("customPrices");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const allItems = useMemo(
    () => ({ ...data.tambang, ...data.perhiasan }),
    [data],
  );

  const calcCost = (req?: Record<string, number>): number => {
    if (!req) return 0;
    let cost = 0;

    for (const [item, qty] of Object.entries(req)) {
      const d = allItems[item];
      if (!d) continue;
      const sub =
        d.require && Object.keys(d.require).length > 0
          ? calcCost(d.require)
          : d.price;

      cost += (sub || d.price) * qty;
    }

    return cost;
  };

  const items = useMemo(() => {
    return Object.entries(allItems).map(([name, d]) => {
      const cost = calcCost(d.require);
      const profit = d.price - cost;
      const margin = cost > 0 ? (profit / cost) * 100 : 0;

      let category = "raw";

      if (Object.keys(data.tambang).includes(name)) {
        if (name.includes("ingot")) category = "ingots";
        else if (
          ["diamond", "ruby", "sapphire", "emerald"].some((g) =>
            name.includes(g),
          )
        )
          category = "gems";
        else category = "raw";
      } else {
        if (isBase(name)) category = "base";
        else if (name.includes("ring")) category = "rings";
        else if (name.includes("earring")) category = "earrings";
        else category = "necklaces";
      }

      const hasReq = Object.keys(d.require ?? {}).length > 0;
      let t: Tier = "none";

      if (!isBase(name) && hasReq) {
        if (margin >= 50) t = "topPriority";
        else if (margin >= 25) t = "recommended";
        else if (margin > 0) t = "lowProfit";
      }

      return {
        name,
        displayName: fmt(name),
        price: d.price,
        require: d.require,
        cost,
        profit,
        margin,
        category,
        hasReq,
        tier: t,
      };
    });
  }, [allItems]);

  const filtered = useMemo(() => {
    let list = items;

    if (search)
      list = list.filter((i) =>
        i.displayName.toLowerCase().includes(search.toLowerCase()),
      );
    if (cat !== "all") list = list.filter((i) => i.category === cat);
    if (tier !== "all") list = list.filter((i) => i.tier === tier);

    return [...list].sort((a, b) =>
      sort === "desc" ? b.margin - a.margin : a.margin - b.margin,
    );
  }, [items, search, cat, tier, sort]);

  const profitColor = (profit: number, margin: number, name: string) => {
    if (isBase(name)) return "text-accent";
    if (profit <= 0) return "text-danger";
    if (margin >= 50) return "text-success";
    if (margin >= 25) return "text-accent";
    return "text-warning";
  };

  const getTierProps = (t: Tier) => {
    if (t === "topPriority")
      return {
        color: "success" as const,
        icon: faFire,
        label: "Prioritas Utama",
      };
    if (t === "recommended")
      return {
        color: "accent" as const,
        icon: faCheckCircle,
        label: "Direkomendasikan",
      };
    if (t === "lowProfit")
      return {
        color: "warning" as const,
        icon: faBolt,
        label: "Profit Rendah",
      };
    return null;
  };

  const maxMargin = Math.max(...filtered.map((i) => i.margin), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className={title({ size: "md", class: "block mt-1" })}>
          Item Info &amp;{" "}
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Harga
          </span>
        </h1>
        <p className="text-sm text-muted mt-2">
          Daftar semua item, requirement, dan analisis profit
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-surface/50 border border-separator">
        <Card.Content className="p-5 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none"
              />
              <Input
                className="pl-9 w-full"
                placeholder="Cari item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-56">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="text-muted text-sm"
                />
              </div>
              <select
                className="w-full h-10 pl-9 pr-8 bg-background border-2 border-transparent hover:border-separator/80 rounded-lg text-sm appearance-none outline-none focus:border-primary transition-colors cursor-pointer"
                aria-label="Filter by Tier"
                defaultValue="all"
                onChange={(e) => setTier(e.target.value as TierFilter)}
              >
                {TIER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-muted text-xs"
                />
              </div>
            </div>

            <Button
              className="w-full sm:w-auto px-6 font-medium"
              variant="ghost"
              onPress={() => setSort((s) => (s === "desc" ? "asc" : "desc"))}
            >
              Margin: {sort === "desc" ? "Tinggi → Rendah" : "Rendah → Tinggi"}{" "}
              <FontAwesomeIcon
                icon={sort === "desc" ? faChevronDown : faChevronUp}
              />
            </Button>
          </div>

          <div className="flex flex-wrap bg-background shadow-inner rounded-xl p-1 gap-1">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${cat === c.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground hover:bg-surface"}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 pt-4 border-t border-separator/50 mt-2">
            {[
              {
                label: "Total Item",
                val: filtered.length,
                color: "text-accent",
              },
              {
                label: "Profitable",
                val: filtered.filter((i) => !isBase(i.name) && i.profit > 0)
                  .length,
                color: "text-success",
              },
              {
                label: "Base Components",
                val: filtered.filter((i) => isBase(i.name)).length,
                color: "text-accent",
              },
              {
                label: "Raw Material",
                val: filtered.filter((i) => !i.hasReq).length,
                color: "text-warning",
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={`font-bold text-2xl ${s.color}`}>{s.val}</span>
                <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const tierProps = getTierProps(item.tier);
            const isHighlight = item.tier === "topPriority";

            return (
              <Card
                key={item.name}
                className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isHighlight
                    ? "border-2 border-success/50 bg-success/5"
                    : item.tier === "recommended"
                      ? "border border-accent/30"
                      : "border border-separator bg-surface/30"
                }`}
              >
                <Card.Header className="flex flex-col items-stretch gap-3 p-4 pb-2 border-b border-separator/30">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-foreground text-[15px] leading-tight">
                      {item.displayName}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      {item.hasReq && (
                        <FontAwesomeIcon
                          className="text-muted/70 text-xs"
                          icon={faCalculator}
                        />
                      )}
                      {item.margin >= 25 && !isBase(item.name) && (
                        <FontAwesomeIcon
                          className="text-success text-xs"
                          icon={faChartLine}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-bold text-2xl text-success tracking-tight">
                      {fmtUSD(item.price)}
                    </span>
                    {item.profit !== 0 && (
                      <span
                        className={`text-sm font-bold ${profitColor(item.profit, item.margin, item.name)}`}
                      >
                        {item.profit > 0 ? "+" : ""}
                        {fmtUSD(item.profit)}
                      </span>
                    )}
                  </div>

                  {item.hasReq && !isBase(item.name) && item.margin > 0 && (
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${item.margin >= 50 ? "bg-success" : item.margin >= 25 ? "bg-accent" : "bg-warning"}`}
                        style={{
                          width: `${Math.min((item.margin / maxMargin) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </Card.Header>

                <Card.Content className="p-4 bg-background/40">
                  {item.hasReq ? (
                    <div className="flex flex-col">
                      <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-3">
                        Requirements
                      </div>
                      <div className="flex flex-col gap-1.5 mb-3">
                        {Object.entries(item.require ?? {}).map(([r, q]) => (
                          <div
                            key={r}
                            className="flex justify-between items-center text-xs text-muted"
                          >
                            <span className="font-medium">{fmt(r)}</span>
                            <span className="text-foreground/70 bg-surface px-1.5 py-0.5 rounded-md border border-separator/30">
                              ×{q as number}
                            </span>
                          </div>
                        ))}
                      </div>
                      {item.cost > 0 && (
                        <div className="pt-3 border-t border-separator/30 flex justify-between items-center mt-auto">
                          <span className="text-[10px] text-muted uppercase font-semibold">
                            Total Cost
                          </span>
                          <span className="text-sm text-warning font-bold">
                            {fmtUSD(item.cost)}
                          </span>
                        </div>
                      )}
                      {item.margin > 0 && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-muted uppercase font-semibold">
                            Margin
                          </span>
                          <span
                            className={`text-sm font-bold ${profitColor(item.profit, item.margin, item.name)}`}
                          >
                            {item.margin.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-4 opacity-70">
                      <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                        <FontAwesomeIcon icon={faBoxOpen} />
                      </div>
                      <span className="text-xs text-warning tracking-wide font-medium">
                        Raw Material
                      </span>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-separator/30 flex justify-start">
                    {isBase(item.name) ? (
                      <Chip
                        color="accent"
                        variant="soft"
                        size="sm"
                        className="h-6"
                      >
                        Base Component
                      </Chip>
                    ) : item.hasReq ? (
                      tierProps ? (
                        <Chip
                          color={tierProps.color}
                          variant="soft"
                          size="sm"
                          className="h-6"
                        >
                          <FontAwesomeIcon
                            icon={tierProps.icon}
                            className="mr-1 text-[10px]"
                          />
                          {tierProps.label}
                        </Chip>
                      ) : (
                        <Chip
                          color="default"
                          variant="soft"
                          size="sm"
                          className="h-6"
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="mr-1 text-[10px]"
                          />
                          Tidak Profitable
                        </Chip>
                      )
                    ) : null}
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-surface/50 border-dashed border-separator shadow-none py-20 mt-4">
          <Card.Content className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-background border border-separator flex items-center justify-center text-muted">
              <FontAwesomeIcon className="text-2xl" icon={faSearch} />
            </div>
            <span className="font-bold text-foreground text-xl">
              Tidak ada item ditemukan
            </span>
            <span className="text-sm text-muted">
              Coba ubah filter atau kata kunci pencarian Anda
            </span>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
