import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye, Mail, FileText, Image, CheckCircle2, AlertTriangle, Clock, Loader2, Send,
  ChevronRight, X, RotateCcw, Search, Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type JobStatus = "pending" | "extracting" | "needs_review" | "approved" | "pushed";

interface VisionJob {
  id: string;
  source: "email" | "pdf" | "photo";
  subject: string;
  customer: string;
  created_at: string;
  status: JobStatus;
  error_flag?: string | null;
  extracted_fields?: {
    items?: { name: string; qty: number; size: string; color: string }[];
    poNumber?: string;
    dueDate?: string;
  } | null;
}

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending:      { label: "Pending",            className: "bg-muted text-muted-foreground",           icon: Clock },
  extracting:   { label: "Extracting",         className: "bg-accent/20 text-accent",                 icon: Loader2 },
  needs_review: { label: "Needs Review",       className: "bg-primary/20 text-primary",               icon: AlertTriangle },
  approved:     { label: "Approved",           className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  pushed:       { label: "Pushed to Printavo", className: "bg-accent/20 text-accent",                 icon: Send },
};

const SOURCE_ICON: Record<string, React.ElementType> = { email: Mail, pdf: FileText, photo: Image };

export default function AIVisionJobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<VisionJob | null>(null);
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newJob, setNewJob] = useState({ source: "email", subject: "", customer: "" });

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["vision-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vision_jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as VisionJob[]) ?? [];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (job: { source: string; subject: string; customer: string }) => {
      const { error } = await supabase.from("vision_jobs").insert({
        user_id: user!.id,
        source: job.source,
        subject: job.subject,
        customer: job.customer,
        status: "pending",
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vision-jobs"] });
      setShowCreate(false);
      setNewJob({ source: "email", subject: "", customer: "" });
      toast({ title: "Job created" });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobStatus }) => {
      const { error } = await supabase.from("vision_jobs").update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vision-jobs"] });
      if (selected) {
        setSelected(null);
      }
      toast({ title: "Status updated" });
    },
  });

  const filtered = jobs.filter((j) => {
    if (filter !== "all" && j.status !== filter) return false;
    if (search && !j.subject.toLowerCase().includes(search.toLowerCase()) && !j.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCounts = (s: JobStatus | "all") =>
    s === "all" ? jobs.length : jobs.filter((j) => j.status === s).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Vision Jobs</h1>
          <p className="text-muted-foreground text-sm">Incoming documents processed by the AI Vision agent</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="mr-1 h-3 w-3" />New Job
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {(["all", "pending", "extracting", "needs_review", "approved", "pushed"] as const).map((s) => {
          const cfg = s === "all" ? null : STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg border p-3 text-left transition-colors ${filter === s ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
            >
              <p className="text-xs text-muted-foreground capitalize">{s === "all" ? "All Jobs" : cfg!.label}</p>
              <p className="text-2xl font-bold">{statusCounts(s)}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table */}
        <Card className="flex-1 min-w-0">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by subject or customer…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs h-8 text-sm" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((job) => {
                    const SourceIcon = SOURCE_ICON[job.source] ?? FileText;
                    const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.pending;
                    const StatusIcon = cfg.icon;
                    return (
                      <TableRow key={job.id} className={`cursor-pointer ${selected?.id === job.id ? "bg-muted" : ""}`} onClick={() => setSelected(job)}>
                        <TableCell><SourceIcon className="h-4 w-4 text-muted-foreground" /></TableCell>
                        <TableCell className="font-medium">
                          {job.subject}
                          {job.error_flag && <AlertTriangle className="inline ml-1 h-3.5 w-3.5 text-destructive" />}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{job.customer}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{new Date(job.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={cfg.className}>
                            <StatusIcon className={`mr-1 h-3 w-3 ${job.status === "extracting" ? "animate-spin" : ""}`} />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">{jobs.length === 0 ? "No vision jobs yet. Create one to get started." : "No jobs match your filter"}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail panel */}
        {selected && (
          <Card className="w-full lg:w-[380px] shrink-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{selected.id.substring(0, 8)}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
              </div>
              <CardDescription>{selected.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{selected.customer}</p></div>
                <div><p className="text-muted-foreground text-xs">Source</p><p className="font-medium capitalize">{selected.source}</p></div>
                <div><p className="text-muted-foreground text-xs">Received</p><p className="font-medium">{new Date(selected.created_at).toLocaleString()}</p></div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={(STATUS_CONFIG[selected.status] ?? STATUS_CONFIG.pending).className}>{(STATUS_CONFIG[selected.status] ?? STATUS_CONFIG.pending).label}</Badge>
                </div>
              </div>

              {selected.error_flag && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-destructive text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div><p className="font-medium">Error Flag</p><p>{selected.error_flag}</p></div>
                </div>
              )}

              {selected.extracted_fields && selected.extracted_fields.items && selected.extracted_fields.items.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Extracted Fields</p>
                  {selected.extracted_fields.poNumber && <p className="text-xs text-muted-foreground">PO: {selected.extracted_fields.poNumber}</p>}
                  {selected.extracted_fields.dueDate && <p className="text-xs text-muted-foreground">Due: {selected.extracted_fields.dueDate}</p>}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Item</TableHead>
                        <TableHead className="text-xs">Qty</TableHead>
                        <TableHead className="text-xs">Size</TableHead>
                        <TableHead className="text-xs">Color</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.extracted_fields.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs py-1">{item.name}</TableCell>
                          <TableCell className="text-xs py-1">{item.qty}</TableCell>
                          <TableCell className="text-xs py-1">{item.size}</TableCell>
                          <TableCell className="text-xs py-1">{item.color}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selected.status === "needs_review" && (
                  <>
                    <Button size="sm" variant="outline" className="flex-1"><Mail className="mr-1 h-3 w-3" />Email Customer</Button>
                    <Button size="sm" className="flex-1" onClick={() => updateStatus.mutate({ id: selected.id, status: "approved" })}><CheckCircle2 className="mr-1 h-3 w-3" />Approve</Button>
                  </>
                )}
                {selected.status === "approved" && (
                  <Button size="sm" className="flex-1" onClick={() => updateStatus.mutate({ id: selected.id, status: "pushed" })}><Send className="mr-1 h-3 w-3" />Push to Printavo</Button>
                )}
                {selected.status === "pending" && (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => updateStatus.mutate({ id: selected.id, status: "extracting" })}><RotateCcw className="mr-1 h-3 w-3" />Process</Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Job Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Vision Job</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Source</Label>
              <Select value={newJob.source} onValueChange={(v) => setNewJob({ ...newJob, source: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={newJob.subject} onChange={(e) => setNewJob({ ...newJob, subject: e.target.value })} placeholder="PO #1234 — 100 Gildan Tees" />
            </div>
            <div>
              <Label>Customer</Label>
              <Input value={newJob.customer} onChange={(e) => setNewJob({ ...newJob, customer: e.target.value })} placeholder="Riverside High School" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(newJob)} disabled={!newJob.subject || createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
