import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Route, SplitSquareVertical, Settings2, Plus, Pencil, Trash2, Package, Truck, Paintbrush, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface RoutingRule {
  id: string;
  category: string;
  decoration_type: string;
  supplier: string;
  decorator: string;
}

/* ── Mock split-order demo (stays static for now) ── */
interface SplitItem {
  name: string; qty: number; size: string; supplier: string; decorator: string; decoration: string;
}

const MOCK_INVOICE_ITEMS: SplitItem[] = [
  { name: "Gildan 5000 Tee", qty: 100, size: "Mixed", supplier: "S&S Activewear", decorator: "PrintShop Pro", decoration: "Screen Print" },
  { name: "Nike Dri-FIT Polo", qty: 30, size: "M/L", supplier: "SanMar", decorator: "StitchWorks", decoration: "Embroidery" },
  { name: "Gildan Heavy Hoodie", qty: 25, size: "L/XL", supplier: "S&S Activewear", decorator: "PrintShop Pro", decoration: "Screen Print" },
  { name: "Canvas Tote Bag", qty: 50, size: "OS", supplier: "Alphabroder", decorator: "HeatPress Hub", decoration: "Heat Transfer" },
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

const EMPTY_RULE = { category: "", decoration_type: "", supplier: "", decorator: "" };

export default function OrderRoutingManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);
  const [form, setForm] = useState(EMPTY_RULE);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["routing-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routing_rules")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as unknown as RoutingRule[]) ?? [];
    },
    enabled: !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: async (rule: typeof EMPTY_RULE & { id?: string }) => {
      if (rule.id) {
        const { error } = await supabase.from("routing_rules").update({
          category: rule.category, decoration_type: rule.decoration_type,
          supplier: rule.supplier, decorator: rule.decorator,
        } as any).eq("id", rule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("routing_rules").insert({
          user_id: user!.id, ...rule,
        } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
      setShowDialog(false);
      setEditingRule(null);
      setForm(EMPTY_RULE);
      toast({ title: editingRule ? "Rule updated" : "Rule created" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("routing_rules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routing-rules"] });
      toast({ title: "Rule deleted" });
    },
  });

  const openCreate = () => { setEditingRule(null); setForm(EMPTY_RULE); setShowDialog(true); };
  const openEdit = (rule: RoutingRule) => {
    setEditingRule(rule);
    setForm({ category: rule.category, decoration_type: rule.decoration_type, supplier: rule.supplier, decorator: rule.decorator });
    setShowDialog(true);
  };

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
            <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-3 w-3" />Add Rule</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : (
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
                        <TableCell><Badge variant="secondary" className="font-normal">{rule.decoration_type}</Badge></TableCell>
                        <TableCell><span className="flex items-center gap-1"><Package className="h-3.5 w-3.5 text-muted-foreground" />{rule.supplier}</span></TableCell>
                        <TableCell><span className="flex items-center gap-1"><Paintbrush className="h-3.5 w-3.5 text-muted-foreground" />{rule.decorator}</span></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(rule)}><Pencil className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(rule.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {rules.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No routing rules yet. Add one to get started.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
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
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Original Invoice</p>
                {MOCK_INVOICE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{item.name} — {item.size}</span>
                    <span className="text-muted-foreground">×{item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Route className="h-5 w-5" />
                  <span className="text-xs mt-1">Auto-routed</span>
                </div>
              </div>

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
                    <Button variant="outline" size="sm" className="w-full text-xs">Override Destination</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRule ? "Edit" : "Add"} Routing Rule</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Product Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="T-Shirts" /></div>
            <div><Label>Decoration Type</Label><Input value={form.decoration_type} onChange={(e) => setForm({ ...form, decoration_type: e.target.value })} placeholder="Screen Print" /></div>
            <div><Label>Supplier</Label><Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="S&S Activewear" /></div>
            <div><Label>Decorator</Label><Input value={form.decorator} onChange={(e) => setForm({ ...form, decorator: e.target.value })} placeholder="PrintShop Pro" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button
              onClick={() => upsertMutation.mutate(editingRule ? { ...form, id: editingRule.id } : form)}
              disabled={!form.category || !form.supplier || upsertMutation.isPending}
            >
              {upsertMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {editingRule ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
