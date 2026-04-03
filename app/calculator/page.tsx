"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, Input, Chip, ScrollShadow } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBoxOpen,
  faChartBar,
  faChartLine,
  faCheckCircle,
  faCheckDouble,
  faCircle,
  faClock,
  faExclamationCircle,
  faGem,
  faLayerGroup,
  faLink,
  faRing,
  faShoppingBag,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";

import miningData from "@/data/mining.json";
import {
  Inventory,
  MiningData,
  OptimizationResult,
  OptimizedStep,
  RequirementInfo,
} from "@/types/game";
import { title } from "@/components/primitives";

/* ── Constants ─────────────────────────────────────────────── */

const CATEGORIES = {
  "Raw Materials": {
    icon: faBoxOpen,
    items: [
      "copper_ore",
      "iron_ore",
      "gold_ore",
      "silver_ore",
      "alluminium_ore",
      "coal",
      "uncut_sapphire",
      "uncut_diamond",
      "uncut_ruby",
      "uncut_emerald",
    ],
  },
  Ingots: {
    icon: faLayerGroup,
    items: [
      "copper_ingot",
      "iron_ingot",
      "gold_ingot",
      "silver_ingot",
      "alluminium_ingot",
      "steel_ingot",
      "sapphire",
      "diamond",
      "ruby",
      "emerald",
    ],
  },
  Rings: {
    icon: faRing,
    items: [
      "gold_ring",
      "silver_ring",
      "emerald_ring",
      "ruby_ring",
      "sapphire_ring",
      "diamond_ring_silver",
      "emerald_ring_silver",
      "ruby_ring_silver",
      "sapphire_ring_silver",
    ],
  },
  Earrings: {
    icon: faGem,
    items: [
      "gold_earring",
      "silver_earring",
      "diamond_earring",
      "ruby_earring",
      "sapphire_earring",
      "emerald_earring",
      "diamond_earring_silver",
      "ruby_earring_silver",
      "sapphire_earring_silver",
      "emerald_earring_silver",
    ],
  },
  Necklaces: {
    icon: faLink,
    items: [
      "gold_chain",
      "silver_chain",
      "ruby_necklace",
      "sapphire_necklace",
      "emerald_necklace",
      "diamond_necklace_silver",
      "ruby_necklace_silver",
      "emerald_necklace_silver",
      "sapphire_necklace_silver",
    ],
  },
} as const;

type CatKey = keyof typeof CATEGORIES;

const fmt = (n: string) =>
  n.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const createEmpty = (): Inventory =>
  Object.values(CATEGORIES)
    .flatMap((c) => c.items)
    .reduce((acc, k) => ({ ...acc, [k]: 0 }), {});

/* ── Component ─────────────────────────────────────────────── */

export default function CalculatorPage() {
  const [mData, setMData] = useState<MiningData>(miningData as MiningData);
  const [inventory, setInventory] = useState<Inventory>(createEmpty());
  const [result, setResult] = useState<OptimizationResult["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Raw Materials");
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("customPrices");
    if (saved) setMData(JSON.parse(saved));
  }, []);

  const allItems = { ...mData.tambang, ...mData.perhiasan };
  const totalItems = Object.values(inventory).reduce((s, v) => s + v, 0);
  const getPrice = (k: string) => allItems[k]?.price ?? 0;

  const filledInCat = (cat: CatKey) =>
    CATEGORIES[cat].items.filter((i) => (inventory[i] ?? 0) > 0).length;

  const handleChange = useCallback((k: string, val: string) => {
    const n = parseInt(val.replace(/\D/g, "")) || 0;
    setInventory((p) => ({ ...p, [k]: Math.max(0, n) }));
  }, []);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setCompleted(new Set());
    try {
      const cp = JSON.parse(localStorage.getItem("customPrices") || "{}");
      const res = await fetch("/api/optimizecrafting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventory, customPrices: cp }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: OptimizationResult = await res.json();

      if (!data.success) throw new Error(data.error || "Unknown error");
      setResult(data.data ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = (i: number) =>
    setCompleted((p) => {
      const s = new Set(p);
      s.has(i) ? s.delete(i) : s.add(i);
      return s;
    });

  const tierOf = (v: number, steps: OptimizedStep[]) => {
    if (!steps.length) return "mid";
    const vals = steps.map((s) => s.value).sort((a, b) => b - a);
    const p25 = vals[Math.floor(vals.length * 0.25)] ?? 0;
    const p75 = vals[Math.floor(vals.length * 0.75)] ?? 0;

    if (v >= p25) return "high";
    if (v <= p75) return "low";
    return "mid";
  };

  const progressPct = result
    ? Math.round((completed.size / result.productionSteps.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="text-center mb-2">
        <h1 className={title({ size: "md", class: "block mt-1" })}>
          Mining &amp; Crafting{" "}
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Optimizer
          </span>
        </h1>
        <p className="text-sm text-muted mt-2">
          Kalkulasi strategi crafting paling optimal untuk server IMERP
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_5fr] gap-6">
        {/* ── Left: Inventory ── */}
        <Card className="bg-surface/50 border border-separator/50 shadow-none h-full max-h-[800px] flex flex-col">
          <Card.Header className="flex gap-3 justify-between px-6 pt-6 pb-2 border-b border-separator/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-lg">
                <FontAwesomeIcon icon={faBoxOpen} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-md">
                  Inventory
                </span>
                <span className="text-xs text-muted">
                  {totalItems.toLocaleString()} items
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {totalItems > 0 && (
                <Button
                  size="sm"
                  variant="danger"
                  onPress={() => setInventory(createEmpty())}
                >
                  <FontAwesomeIcon icon={faUndoAlt} /> Clear
                </Button>
              )}
            </div>
          </Card.Header>

          <Card.Content className="p-0 overflow-hidden flex flex-col">
            <ScrollShadow className="w-full shrink-0" orientation="horizontal">
              <div className="flex px-6 pt-2">
                {(Object.keys(CATEGORIES) as CatKey[]).map((cat) => {
                  const filled = filledInCat(cat);
                  const isSelected = activeTab === cat;

                  return (
                    <button
                      key={cat}
                      className={`relative px-4 py-3 text-sm font-medium transition-colors ${isSelected ? "text-foreground" : "text-muted hover:text-foreground"}`}
                      onClick={() => setActiveTab(cat)}
                    >
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <FontAwesomeIcon icon={CATEGORIES[cat].icon} />
                        <span>{cat}</span>
                        {filled > 0 && (
                          <Chip
                            size="sm"
                            color="accent"
                            variant="soft"
                            className="h-4 px-1 text-[9px]"
                          >
                            {filled}
                          </Chip>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="w-full h-px bg-separator/30 mx-6 mb-2" />
            </ScrollShadow>

            <ScrollShadow className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES[activeTab as CatKey].items.map((item) => {
                  const price = getPrice(item);
                  const val = inventory[item] ?? 0;
                  const hasValue = val > 0;

                  return (
                    <div
                      key={item}
                      className={`flex flex-col gap-2 p-3 rounded-xl border transition-all duration-200 ${
                        hasValue
                          ? "bg-accent/5 border-accent/30"
                          : "bg-surface border-separator hover:border-accent/20"
                      }`}
                    >
                      <Input
                        type="number"
                        min={0}
                        value={val === 0 ? "" : val.toString()}
                        onChange={(e) => handleChange(item, e.target.value)}
                        placeholder="0"
                        className={`font-mono font-semibold text-center text-sm w-full ${hasValue ? "border-accent" : ""}`}
                      />
                      <div className="flex flex-col gap-1 mt-1 text-center">
                        <span
                          className={`text-xs ${hasValue ? "text-foreground font-medium" : "text-muted"}`}
                        >
                          {fmt(item)}
                        </span>
                        <div className="flex justify-center">
                          {price > 0 ? (
                            <Chip
                              size="sm"
                              variant="soft"
                              color="success"
                              className="h-4 text-[9px] px-1"
                            >
                              ${price}/unit
                            </Chip>
                          ) : (
                            <Chip
                              size="sm"
                              variant="tertiary"
                              className="h-4 text-[9px] px-1 text-muted"
                            >
                              raw
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollShadow>

            <div className="p-4 border-t border-separator/30 bg-surface/30">
              <Button
                variant="primary"
                size="lg"
                className="w-full font-semibold shadow-md"
                isDisabled={totalItems === 0 || loading}
                isPending={loading}
                onPress={handleOptimize}
              >
                {loading ? (
                  "Menghitung..."
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBolt} /> Hitung Optimasi
                  </>
                )}
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* ── Right: Results ── */}
        <Card className="bg-surface/50 border border-separator/50 shadow-none h-full max-h-[800px] flex flex-col">
          <Card.Header className="flex gap-3 justify-between px-6 pt-6 pb-2 border-b border-separator/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success text-lg">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <span className="font-bold text-foreground text-md">
                Hasil Optimasi
              </span>
            </div>
            {completed.size > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-foreground"
                onPress={() => {
                  setCompleted(new Set());
                  handleOptimize();
                }}
              >
                <FontAwesomeIcon icon={faUndoAlt} /> Reset Progress
              </Button>
            )}
          </Card.Header>

          <ScrollShadow className="flex-1 p-6">
            {error && (
              <Card className="mb-6 bg-danger/10 border-danger/30 shadow-none">
                <Card.Content className="flex flex-row gap-3 items-center p-4">
                  <FontAwesomeIcon
                    className="text-danger text-xl"
                    icon={faExclamationCircle}
                  />
                  <div>
                    <p className="text-sm font-semibold text-danger">Error</p>
                    <p className="text-xs text-danger/80">{error}</p>
                  </div>
                </Card.Content>
              </Card>
            )}

            {result ? (
              <div className="flex flex-col gap-6">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Net Profit",
                      value: fmtUSD(result.summary.totalProfit),
                      color: "success" as const,
                    },
                    {
                      label: "Total Jual",
                      value: fmtUSD(result.summary.totalSellValue),
                      color: "accent" as const,
                    },
                    {
                      label: "Waktu",
                      value: result.summary.totalTimeFormatted,
                      color: "warning" as const,
                    },
                  ].map((s) => (
                    <Card
                      key={s.label}
                      className={`border border-${s.color}/20 bg-${s.color}/5 shadow-none`}
                    >
                      <Card.Content className="py-3 px-4 flex flex-col items-center justify-center gap-1">
                        <span className="text-[10px] uppercase font-semibold text-muted tracking-wide">
                          {s.label}
                        </span>
                        <span className={`font-bold text-md text-${s.color}`}>
                          {s.value}
                        </span>
                      </Card.Content>
                    </Card>
                  ))}
                </div>

                {/* Production steps */}
                {result.productionSteps.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          className="text-success text-sm"
                          icon={faChartLine}
                        />
                        <span className="font-bold text-foreground text-sm">
                          Langkah Produksi
                        </span>
                        <Chip
                          size="sm"
                          variant="soft"
                          className="h-5 text-[10px]"
                        >
                          {result.productionSteps.length}
                        </Chip>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted">Progress</span>
                        <span className="font-semibold text-foreground">
                          {completed.size} / {result.productionSteps.length}{" "}
                          selesai
                        </span>
                      </div>
                      <div className="w-full h-2 bg-background border border-separator/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${completed.size === result.productionSteps.length ? "bg-success" : "bg-primary"}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {result.productionSteps.map((step, idx) => {
                        const tier = tierOf(step.value, result.productionSteps);
                        const done = completed.has(idx);

                        const borderColor = done
                          ? "border-success/40"
                          : tier === "high"
                            ? "border-success/40"
                            : tier === "mid"
                              ? "border-accent/40"
                              : "border-warning/40";
                        const barColor = done
                          ? "bg-success"
                          : tier === "high"
                            ? "bg-success"
                            : tier === "mid"
                              ? "bg-accent"
                              : "bg-warning";
                        const valueColor = done
                          ? "text-success"
                          : tier === "high"
                            ? "text-success"
                            : tier === "mid"
                              ? "text-accent"
                              : "text-warning";

                        return (
                          <Card
                            key={idx}
                            onClick={() => toggleDone(idx)}
                            className={`relative border shadow-none transition-all cursor-pointer ${borderColor} ${done ? "opacity-60 bg-success/5" : "bg-background"}`}
                          >
                            <div
                              className={`absolute left-0 top-0 bottom-0 w-1 ${barColor}`}
                            />
                            <Card.Content className="p-4 pl-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0 flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <Chip
                                      size="sm"
                                      variant="secondary"
                                      className="h-5 px-1 font-mono text-[10px]"
                                    >
                                      #{idx + 1}
                                    </Chip>
                                    <span
                                      className={`font-bold text-sm ${done ? "line-through text-muted" : "text-foreground"}`}
                                    >
                                      {step.displayName}
                                    </span>
                                    <Chip
                                      size="sm"
                                      variant="soft"
                                      className="h-5 px-1 text-[10px]"
                                    >
                                      x{step.quantity.toLocaleString()}
                                    </Chip>
                                  </div>

                                  {step.requirements.length > 0 && (
                                    <div className="text-xs text-muted/80 bg-surface/40 p-2 rounded-lg border border-separator/30">
                                      <span className="font-semibold text-muted mr-1">
                                        Tweak:
                                      </span>
                                      {step.requirements.map(
                                        (r: RequirementInfo, ri: number) => (
                                          <span key={r.item}>
                                            {ri > 0 && (
                                              <span className="text-muted/40 pointer-events-none">
                                                ,{" "}
                                              </span>
                                            )}
                                            <span className="text-foreground/80">
                                              {r.displayName}
                                            </span>
                                            <span className="text-muted/60 opacity-80">
                                              {" "}
                                              x{r.quantity.toLocaleString()}
                                            </span>
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 flex-wrap mt-1">
                                    <Chip
                                      size="sm"
                                      variant="soft"
                                      className="text-[10px] bg-surface h-5"
                                    >
                                      <FontAwesomeIcon
                                        icon={faClock}
                                        className="text-[10px] mr-1"
                                      />
                                      {step.timeFormatted}
                                    </Chip>
                                    {step.profitMargin &&
                                      step.profitMargin > 0 && (
                                        <Chip
                                          size="sm"
                                          variant="soft"
                                          color={
                                            tier === "high"
                                              ? "success"
                                              : tier === "mid"
                                                ? "accent"
                                                : "warning"
                                          }
                                          className="text-[10px] h-5"
                                        >
                                          +{step.profitMargin.toFixed(1)}%
                                          margin
                                        </Chip>
                                      )}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 shrink-0">
                                  <span
                                    className={`font-bold text-md ${valueColor}`}
                                  >
                                    {fmtUSD(step.value)}
                                  </span>
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? "border-success bg-success text-white" : "border-separator text-muted"}`}
                                  >
                                    <FontAwesomeIcon
                                      icon={done ? faCheckCircle : faCircle}
                                    />
                                  </div>
                                </div>
                              </div>
                            </Card.Content>
                          </Card>
                        );
                      })}
                    </div>

                    {completed.size === result.productionSteps.length &&
                      result.productionSteps.length > 0 && (
                        <Card className="mt-2 bg-success/10 border-success/30 shadow-none">
                          <Card.Content className="flex flex-row items-center gap-3 p-4 py-3">
                            <FontAwesomeIcon
                              className="text-success text-lg"
                              icon={faCheckCircle}
                            />
                            <span className="text-sm font-semibold text-success">
                              Optimasi selesai! Semua langkah telah dikerjakan.
                            </span>
                          </Card.Content>
                        </Card>
                      )}
                  </div>
                )}

                {/* Sellable items */}
                {result.sellableItems.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <FontAwesomeIcon
                        className="text-success text-sm"
                        icon={faShoppingBag}
                      />
                      <span className="font-bold text-foreground text-sm">
                        Item Siap Jual
                      </span>
                      <Chip
                        size="sm"
                        variant="soft"
                        className="h-5 text-[10px]"
                      >
                        {result.sellableItems.length}
                      </Chip>
                    </div>
                    <div className="flex flex-col gap-2">
                      {result.sellableItems.map((item, i) => (
                        <Card
                          key={i}
                          className="bg-background border border-separator/50 shadow-none"
                        >
                          <Card.Content className="flex flex-row items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success text-xs">
                                <FontAwesomeIcon icon={faCheckDouble} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">
                                  {item.name}
                                </span>
                                <span className="text-xs text-muted">
                                  x{item.quantity} units
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-sm text-success">
                              {fmtUSD(item.value)}
                            </span>
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
                <div className="w-20 h-20 mb-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-3xl shadow-inner">
                  ⛏
                </div>
                <h3 className="font-bold text-foreground text-xl mb-2">
                  Siap Optimasi
                </h3>
                <p className="text-sm text-muted max-w-sm leading-relaxed mb-6">
                  Masukkan jumlah item di inventory lalu klik{" "}
                  <strong>Hitung Optimasi</strong> untuk melihat rute crafting
                  terbaik dan estimasi profit Anda.
                </p>
                {totalItems === 0 && (
                  <Chip variant="soft" size="md">
                    Inventory masih kosong
                  </Chip>
                )}
              </div>
            )}
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
}
