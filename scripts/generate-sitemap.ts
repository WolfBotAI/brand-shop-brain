import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://brand-shop.ai";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/assessment", changefreq: "monthly", priority: "0.8" },
  { path: "/for/distributors", changefreq: "monthly", priority: "0.8" },
  { path: "/for/decorators", changefreq: "monthly", priority: "0.8" },
  { path: "/for/referral-partners", changefreq: "monthly", priority: "0.7" },
  { path: "/features/store-builder", changefreq: "monthly", priority: "0.8" },
  { path: "/features/ai-vision", changefreq: "monthly", priority: "0.8" },
  { path: "/features/ai-support", changefreq: "monthly", priority: "0.8" },
  { path: "/features/ai-suggestions", changefreq: "monthly", priority: "0.7" },
  { path: "/features/order-routing", changefreq: "monthly", priority: "0.7" },
  { path: "/features/multi-store", changefreq: "monthly", priority: "0.7" },
  { path: "/features/kpi-reports", changefreq: "monthly", priority: "0.7" },
  { path: "/features/reporting", changefreq: "monthly", priority: "0.7" },
  { path: "/features/site-migration", changefreq: "monthly", priority: "0.7" },
  { path: "/features/popup-stores", changefreq: "monthly", priority: "0.7" },
  { path: "/features/acquisition", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/blog/ai-product-designer-custom-apparel-storefronts-2026", changefreq: "monthly", priority: "0.7" },
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
