import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Route, ArrowRight, SplitSquareVertical, Settings2, Plus, Pencil, Trash2, Package, Truck, Paintbrush,
} from "lucide-react";

/* ── Mock routing rules ── */
interface RoutingRule {
  id: string;
  category: string;
  decorationType: string;
  supplier: string;
  decorator: string;
}

const MOCK_RULES: RoutingRule[] = [
  { id: "R1", category: "T-Shirts",    decorationType: "Screen Print",  supplier: "S&S Activewear",  decorator: "PrintShop Pro" },
  { id: "R2", category: "T-Shirts",    decorationType: "DTG",           supplier: "S&S Activewear",  decorator: "DTG Express" },
  { id: "R3", category: "Polos",       decorationType: "Embroidery",    supplier: "SanMar",          decorator: "StitchWorks" },
  { id: "R4", category: "Hoodies",     decorationType: "Screen Print",  supplier: "S&S Activewear",  decorator: "PrintShop Pro" },
  { id: "R5", category: "Caps / Hats", decorationType: "Embroidery",    supplier: "SanMar",          decorator: "StitchWorks" },
  { id: "R6", category: "Tote Bags",   decorationType: "Heat Transfer", supplier: "Alphabroder",     decorator: "HeatPress Hub" },
];

/* ── Mock split-order demo ── */
interface SplitItem {
  name: string;
  qty: number;
  size: string;
  supplier: string;
  decorator: string;
  decoration: string;
}

const MOCK_INVOICE_ITEMS: SplitItem[] = [
  { name: "Gildan 5000 Tee",      qty: 100, size: "Mixed", supplier: "S&S Activewear", decorator: "PrintShop Pro", decoration: "Screen Print" },
  { name: "Nike Dri-FIT Polo",    qty: 30,  size: "M/L",   supplier: "SanMar",         decorator: "StitchWorks",   decoration: "Embroidery" },
  { name: "Gildan Heavy Hoodie",  qty: 25,  size: "L/XL",  supplier: "S&S Activewear", decorator: "PrintShop Pro", decoration: "Screen Print" },
  { name: "Canvas Tote Bag",      qty: 50,  size: "OS",    supplier: "Alphabroder",    decorator: "HeatPress Hub", decoration: "Heat Transfer" },
];

function groupBy<T>(arr: T[], key: (item: T) => string) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

const DESTINATION_COLORS: Record<string, string> = {
  "S&S Activewear → PrintShop Pro": "border-accent/40 bg-accent/5",
  "SanMar → StitchWorks": "border-primary/40 bg-primary/5",
  "Alphabroder → HeatPress Hub": "border-green-500/40 bg-green-500/5",
};

export default function OrderRoutingManager() {
  const [rules, setRules] = useState(MOCK_RULES);

  const grouped = groupBy(MOCK_INVOICE_ITEMS, (i) => `${i.supplier} → ${i.decorator}`);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order Routing</h1>
        <p className="text-muted-foreground text-sm">One Invoice, Multiple Destinations — configure how orders split across suppliers &amp; decorators</p>
      </div>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules"><Settings2 className="mr-1 h-3.5 w-3.5" />Routing Rules</TabsTrigger>
          <TabsTrigger value="split"><SplitSquareVertical className="mr-1 h-3.5 w-3.5" />Split Order Viewer</TabsTrigger>
        </TabsList>

        {/* ── Rules Tab ── */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{rules.length} routing rules configured</p>
            <Button size="sm"><Plus className="mr-1 h-3 w-3" />Add Rule</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Category</TableHead>
                    <TableHead>Decoration Type</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Decorator</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{rule.decorationType}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5 text-muted-foreground" />{rule.supplier}</span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1"><Paintbrush className="h-3.5 w-3.5 text-muted-foreground" />{rule.decorator}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Split Order Viewer ── */}
        <TabsContent value="split" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demo Invoice — Riverside High School</CardTitle>
              <CardDescription>4 line items automatically split into {Object.keys(grouped).length} fulfillment destinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Source invoice summary */}
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Original Invoice</p>
                {MOCK_INVOICE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{item.name} — {item.size}</span>
                    <span className="text-muted-foreground">×{item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Route className="h-5 w-5" />
                  <span className="text-xs mt-1">Auto-routed</span>
                </div>
              </div>

              {/* Destination cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(grouped).map(([dest, items]) => (
                  <div key={dest} className={`rounded-lg border-2 p-4 space-y-3 ${DESTINATION_COLORS[dest] ?? "border-border"}`}>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <p className="text-sm font-semibold">{dest}</p>
                    </div>
                    {items.map((item, i) => (
                      <div key={i} className="text-xs space-y-0.5">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">{item.decoration} · {item.size} · ×{item.qty}</p>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Override Destination
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
