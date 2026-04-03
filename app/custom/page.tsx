"use client";

import { useEffect, useState } from "react";
import { Button, Input, Chip, Card } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGem,
  faIndustry,
  faSave,
  faSlidersH,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import miningData from "@/data/mining.json";
import { MiningData } from "@/types/game";
import { title } from "@/components/primitives";

const fmt = (n: string) =>
  n.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const defaultData = miningData as MiningData;

export default function CustomPricePage() {
  const [data, setData] = useState<MiningData>(defaultData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("customPrices");
    if (s) setData(JSON.parse(s));
  }, []);

  const update = (cat: "tambang" | "perhiasan", item: string, val: number) => {
    setData((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [item]: { ...prev[cat][item], price: val },
      },
    }));
  };

  const save = () => {
    localStorage.setItem("customPrices", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reset = () => {
    localStorage.removeItem("customPrices");
    setData(defaultData);
  };

  const countModified = (cat: "tambang" | "perhiasan") =>
    Object.entries(data[cat]).filter(
      ([name, item]) => item.price !== defaultData[cat][name]?.price,
    ).length;

  const totalModified = countModified("tambang") + countModified("perhiasan");

  const Section = ({
    accentColor,
    cat,
    icon,
    sectionTitle,
  }: {
    sectionTitle: string;
    cat: "tambang" | "perhiasan";
    accentColor: "success" | "accent";
    icon: IconDefinition;
  }) => {
    const modCount = countModified(cat);

    return (
      <Card className="bg-surface/50 border border-separator/80 shadow-md mb-6 overflow-visible">
        <Card.Header className="flex justify-between items-center px-6 py-4 border-b border-separator/40 bg-surface/30">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg bg-${accentColor}/10 text-${accentColor} flex items-center justify-center`}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight">
              {sectionTitle}
            </span>
            {modCount > 0 && (
              <Chip
                color="warning"
                variant="soft"
                size="sm"
                className="ml-2 px-1 text-xs font-semibold"
              >
                {modCount} diubah
              </Chip>
            )}
          </div>
          <Chip size="sm" variant="secondary" className="px-2">
            {Object.keys(data[cat]).length} items
          </Chip>
        </Card.Header>

        <Card.Content className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(data[cat]).map(([name, item]) => {
              const defaultPrice = defaultData[cat][name]?.price ?? 0;
              const isModified = item.price !== defaultPrice;

              return (
                <div
                  key={name}
                  className={`flex flex-col gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    isModified
                      ? "bg-warning/5 border-warning/40 shadow-sm"
                      : "bg-background border-separator/50 hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-start justify-between min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${isModified ? "bg-warning" : "bg-transparent"}`}
                      />
                      <span className="text-sm font-medium text-foreground truncate">
                        {fmt(name)}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none z-10">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={item.price.toString()}
                      onChange={(e) =>
                        update(cat, name, Number(e.target.value))
                      }
                      className={`pl-5 font-mono font-bold text-right w-full ${isModified ? "border-warning" : ""}`}
                    />
                  </div>

                  <div className="flex justify-end h-4">
                    {isModified && (
                      <span className="text-[10px] uppercase font-semibold text-warning/80">
                        Default: ${defaultPrice}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className={title({ size: "md", class: "block mt-1" })}>
          Custom{" "}
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Item Price
          </span>
        </h1>
        <p className="text-sm text-muted mt-2">
          Sesuaikan harga item untuk kalkulasi yang lebih akurat
        </p>
      </div>

      {/* Action bar */}
      <Card className="bg-surface/50 border border-separator">
        <Card.Content className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <FontAwesomeIcon icon={faSlidersH} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                Konfigurasi Lokal
              </span>
              <span className="text-xs text-muted">
                Disimpan di peramban (browser) anda
              </span>
            </div>
            {totalModified > 0 && (
              <Chip
                color="warning"
                variant="secondary"
                className="ml-auto md:ml-4"
              >
                {totalModified} harga manual
              </Chip>
            )}
          </div>

          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            <Button
              className="flex-1 md:flex-none font-medium"
              variant="danger"
              onPress={reset}
            >
              <FontAwesomeIcon icon={faUndoAlt} />
              Reset Default
            </Button>
            <Button
              className={`flex-1 md:flex-none font-bold shadow-md ${saved ? "opacity-80" : ""}`}
              variant="primary"
              onPress={save}
            >
              <FontAwesomeIcon icon={faSave} />
              {saved ? "Tersimpan ✅" : "Simpan Config"}
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Sections */}
      <div className="flex flex-col">
        <Section
          accentColor="success"
          cat="tambang"
          icon={faIndustry}
          sectionTitle="Tambang (Mining)"
        />
        <Section
          accentColor="accent"
          cat="perhiasan"
          icon={faGem}
          sectionTitle="Perhiasan (Jewelry)"
        />
      </div>
    </div>
  );
}
