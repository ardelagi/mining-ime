import * as fs from "fs";
import * as path from "path";

const miningPath = path.join(process.cwd(), "data/mining.json");
const historyPath = path.join(process.cwd(), "data/price-history.json");

const mining = JSON.parse(fs.readFileSync(miningPath, "utf-8"));
const rawHistory = fs.existsSync(historyPath)
  ? fs.readFileSync(historyPath, "utf-8").trim()
  : "";
const history = rawHistory ? JSON.parse(rawHistory) : [];

const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

if (history.some((s: { date: string }) => s.date === today)) {
  console.log(`Snapshot untuk ${today} sudah ada, dilewati.`);
  process.exit(0);
}

const snapshot: Record<string, unknown> = { date: today };

for (const [cat, items] of Object.entries(mining) as [string, Record<string, { price: number }>][]) {
  snapshot[cat] = Object.fromEntries(
    Object.entries(items).map(([name, data]) => [name, data.price])
  );
}

history.push(snapshot);
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
console.log(`✅ Snapshot ${today} berhasil ditambahkan.`);
