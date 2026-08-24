import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, Plus, Loader2, Clock, Trash2, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import {
import { SEO } from "@/components/seo/SEO";
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

async function fetchStores() {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export default function StoreList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      for (const id of ids) {
        const { error } = await supabase.from("stores").update({ status }).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setSelected(new Set());
      toast({ title: "Updated", description: "Store statuses updated." });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        const { error } = await supabase.from("stores").delete().eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setSelected(new Set());
      toast({ title: "Deleted", description: "Selected stores deleted." });
    },
  });

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!stores) return;
    if (selected.size === stores.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(stores.map((s) => s.id)));
    }
  };

  const getExpiryBadge = (s: any) => {
    const expiresAt = (s as any).expires_at;
    const storeType = (s as any).store_type;
    if (storeType !== "popup" || !expiresAt) return null;
    const expDate = parseISO(expiresAt);
    if (isPast(expDate)) return <Badge variant="destructive" className="text-[10px]">Expired</Badge>;
    return (
      <Badge variant="outline" className="text-[10px] gap-1">
        <Clock className="h-2.5 w-2.5" />
        {formatDistanceToNow(expDate, { addSuffix: false })} left
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <SEO title="Stores | Brand-Shop.AI" description="Manage every branded company store you run, from pop-ups to permanent client storefronts." path="/app/stores" noIndex />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stores</h1>
          <p className="text-muted-foreground text-sm">All your branded storefronts</p>
        </div>
        <Button onClick={() => navigate("/app/onboarding")}><Plus className="mr-1 h-4 w-4" />New Store</Button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Select onValueChange={(status) => bulkStatusMutation.mutate({ ids: Array.from(selected), status })}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue placeholder="Set Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => bulkDeleteMutation.mutate(Array.from(selected))}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Cancel</Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !stores?.length ? (
        <div className="text-center py-16 space-y-3">
          <Store className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No stores yet. Create your first store to get started.</p>
          <Button onClick={() => navigate("/app/onboarding")}>Create Store</Button>
        </div>
      ) : (
        <>
          {stores.length > 1 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selected.size === stores.length}
                onCheckedChange={toggleAll}
              />
              <span className="text-xs text-muted-foreground">Select all</span>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((s) => (
              <Card key={s.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selected.has(s.id)}
                      onCheckedChange={() => toggle(s.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div
                      className="flex-1 cursor-pointer flex items-center justify-between"
                      onClick={() => navigate(`/app/stores/${s.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        {s.logo_url ? (
                          <img src={s.logo_url} alt="" className="h-5 w-5 rounded object-contain" />
                        ) : (
                          <Store className="h-5 w-5 text-primary" />
                        )}
                        <p className="font-semibold">{s.store_name}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getExpiryBadge(s)}
                        <Badge variant={s.status === "live" ? "default" : "secondary"}>{s.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground pl-8">
                    <span>{s.client_name || "No client"}</span>
                    <span>{s.brand_vertical}</span>
                    {(s as any).store_type === "popup" && (
                      <Badge variant="outline" className="text-[10px]">Pop-Up</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
