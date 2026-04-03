"use client";

import { useMemo, useState } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGem,
  faIndustry,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Input, ScrollShadow, Chip } from "@heroui/react";

import priceHistory from "@/data/price-history.json";
import { PriceSnapshot } from "@/types/game";
import { title } from "@/components/primitives";

const history = priceHistory as PriceSnapshot[];

const fmt = (n: string) =>
  n.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const LINE_COLORS = [
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#fbbf24",
  "#a78bfa",
  "#f87171",
  "#2dd4bf",
  "#fb923c",
];

const allTambang = Array.from(
  new Set(history.flatMap((s) => Object.keys(s.tambang ?? {}))),
).filter((k) => history.some((s) => (s.tambang?.[k] ?? 0) > 0));

const allPerhiasan = Array.from(
  new Set(history.flatMap((s) => Object.keys(s.perhiasan ?? {}))),
).filter((k) => history.some((s) => (s.perhiasan?.[k] ?? 0) > 0));

export default function TrendsPage() {
  const [cat, setCat] = useState<"tambang" | "perhiasan">("perhiasan");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(
      cat === "perhiasan" ? allPerhiasan.slice(0, 4) : allTambang.slice(0, 4),
    ),
  );

  const items = cat === "tambang" ? allTambang : allPerhiasan;

  const filtered = items.filter((i) =>
    fmt(i).toLowerCase().includes(search.toLowerCase()),
  );

  const toggleItem = (item: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const switchCat = (nextKey: string) => {
    const next = nextKey as "tambang" | "perhiasan";
    setCat(next);
    setSearch("");

    const nextItems = next === "perhiasan" ? allPerhiasan : allTambang;
    setSelected(new Set(nextItems.slice(0, 4)));
  };

  const chartData = useMemo(
    () =>
      history.map((snap) => {
        const row: Record<string, unknown> = { date: snap.date };

        for (const item of Array.from(selected)) {
          row[item] = snap[cat]?.[item] ?? null;
        }

        return row;
      }),
    [selected, cat],
  );

  const selectedArr = Array.from(selected);

  const changeOf = (item: string) => {
    const first = history[0]?.[cat]?.[item];
    const last = history[history.length - 1]?.[cat]?.[item];

    if (!first || !last) return null;

    return (((last - first) / first) * 100).toFixed(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className={title({ size: "md", class: "block mt-1" })}>
          Trend{" "}
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Harga Item
          </span>
        </h1>
        <p className="text-sm text-muted mt-2">
          Riwayat fluktuasi harga resmi berdasar snapshot sistem
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-surface/50 border border-separator/80 shadow-sm overflow-visible">
        <Card.Content className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex bg-surface shadow-inner rounded-xl p-1 gap-1">
            <button
              onClick={() => switchCat("perhiasan")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${cat === "perhiasan" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
            >
              <FontAwesomeIcon icon={faGem} />
              <span>Perhiasan</span>
            </button>
            <button
              onClick={() => switchCat("tambang")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${cat === "tambang" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
            >
              <FontAwesomeIcon icon={faIndustry} />
              <span>Tambang</span>
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none"
            />
            <Input
              className="w-full pl-9"
              placeholder="Cari item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Item selector */}
        <Card className="bg-surface/50 border border-separator/80 shadow-sm max-h-[580px] flex flex-col overflow-hidden">
          <Card.Header className="p-4 border-b border-separator/40 bg-surface/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <span className="font-bold text-foreground text-md">
                Pilih Item
              </span>
            </div>
            <Chip size="sm" variant="soft" color="accent">
              {selected.size} aktif
            </Chip>
          </Card.Header>

          <ScrollShadow className="flex-1 p-2">
            <div className="flex flex-col gap-1.5">
              {filtered.map((item) => {
                const isSelected = selected.has(item);
                const change = changeOf(item);
                const colorIdx = selectedArr.indexOf(item);
                const color =
                  colorIdx >= 0
                    ? LINE_COLORS[colorIdx % LINE_COLORS.length]
                    : undefined;

                return (
                  <Button
                    key={item}
                    className={`h-auto justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary/30 text-foreground shadow-sm hover:bg-primary/10 hover:border-primary/40"
                        : "bg-transparent border-transparent text-muted hover:border-separator/50 hover:bg-surface"
                    }`}
                    variant="ghost"
                    onPress={() => toggleItem(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-3 h-3">
                        {isSelected && color ? (
                          <div
                            className="absolute inset-0 rounded-full animate-appearance-in"
                            style={{ background: color }}
                          />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-separator/50" />
                        )}
                      </div>
                      <span
                        className={`font-medium truncate max-w-[120px] ${isSelected ? "opacity-100" : "opacity-80"}`}
                      >
                        {fmt(item)}
                      </span>
                    </div>
                    {change !== null && (
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          Number(change) > 0
                            ? "text-success"
                            : Number(change) < 0
                              ? "text-danger"
                              : "text-muted"
                        }`}
                      >
                        {Number(change) > 0 ? "+" : ""}
                        {change}%
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </ScrollShadow>
        </Card>

        {/* Chart */}
        <Card className="bg-surface/50 border border-separator/80 shadow-sm flex flex-col h-[580px]">
          <Card.Header className="p-5 border-b border-separator/40 bg-surface/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <span className="font-bold text-foreground text-lg tracking-tight">
                Grafik Pergerakan
              </span>
            </div>

            <Chip variant="tertiary" className="hidden sm:flex" size="sm">
              <span className="text-muted">
                {history.length} data point {"·"} {history[0]?.date} {"→"}{" "}
                {history[history.length - 1]?.date}
              </span>
            </Chip>
          </Card.Header>

          <Card.Content className="p-6">
            {history.length < 2 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <div className="w-20 h-20 rounded-full bg-surface-secondary border border-separator flex items-center justify-center text-4xl shadow-inner">
                  📈
                </div>
                <div className="font-bold text-foreground text-xl">
                  Data Belum Ideal
                </div>
              </div>
            ) : selected.size === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-4xl opacity-20 mb-2"
                />
                <span className="text-md font-medium">
                  Pilih minimal 1 item untuk melihat grafiknya
                </span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--color-muted, #888)" }}
                    tickLine={false}
                    tickMargin={12}
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--color-muted, #888)" }}
                    tickFormatter={(v) => `$${v}`}
                    tickLine={false}
                    tickMargin={12}
                    width={56}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--color-surface))",
                      border: "1px solid hsl(var(--color-separator)/0.5)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow:
                        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                    itemStyle={{
                      paddingTop: "4px",
                      fontWeight: 600,
                    }}
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      fmt(String(name)),
                    ]}
                    labelStyle={{
                      color: "hsl(var(--color-muted))",
                      marginBottom: "8px",
                      fontWeight: 500,
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="font-medium ml-1 mr-3 text-foreground/80">
                        {fmt(value)}
                      </span>
                    )}
                    wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }}
                    iconType="circle"
                  />
                  {selectedArr.map((item, idx) => (
                    <Line
                      key={item}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      connectNulls
                      dataKey={item}
                      dot={{ r: 4, strokeWidth: 0 }}
                      stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                      strokeWidth={3}
                      type="monotone"
                      animationDuration={1000}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
