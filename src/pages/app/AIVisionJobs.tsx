import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye, Mail, FileText, Image, CheckCircle2, AlertTriangle, Clock, Loader2, Send,
  ChevronRight, X, RotateCcw, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type JobStatus = "pending" | "extracting" | "needs_review" | "approved" | "pushed";

interface VisionJob {
  id: string;
  source: "email" | "pdf" | "photo";
  subject: string;
  customer: string;
  receivedAt: string;
  status: JobStatus;
  errorFlag?: string;
  extractedFields?: {
    items: { name: string; qty: number; size: string; color: string }[];
    poNumber?: string;
    dueDate?: string;
  };
}

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending:      { label: "Pending",        className: "bg-muted text-muted-foreground",           icon: Clock },
  extracting:   { label: "Extracting",     className: "bg-accent/20 text-accent",                 icon: Loader2 },
  needs_review: { label: "Needs Review",   className: "bg-primary/20 text-primary",               icon: AlertTriangle },
  approved:     { label: "Approved",       className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  pushed:       { label: "Pushed to Printavo", className: "bg-accent/20 text-accent",             icon: Send },
};

const MOCK_JOBS: VisionJob[] = [
  {
    id: "VJ-001", source: "email", subject: "PO #4521 — 200 Gildan Tees",
    customer: "Riverside High School", receivedAt: "2026-03-04 09:15",
    status: "needs_review", errorFlag: "Size breakdown missing for 2XL",
    extractedFields: {
      poNumber: "PO-4521", dueDate: "2026-03-18",
      items: [
        { name: "Gildan 5000 Tee", qty: 120, size: "L", color: "Navy" },
        { name: "Gildan 5000 Tee", qty: 60, size: "XL", color: "Navy" },
        { name: "Gildan 5000 Tee", qty: 20, size: "2XL", color: "Navy" },
      ],
    },
  },
  {
    id: "VJ-002", source: "pdf", subject: "Spring Fundraiser Order",
    customer: "Main Street Bakery", receivedAt: "2026-03-04 08:42",
    status: "extracting",
  },
  {
    id: "VJ-003", source: "photo", subject: "Handwritten PO — Coach Martinez",
    customer: "Lincoln Youth Football", receivedAt: "2026-03-03 16:30",
    status: "approved",
    extractedFields: {
      poNumber: "LYF-88", dueDate: "2026-03-25",
      items: [
        { name: "Nike Dri-FIT Polo", qty: 30, size: "M", color: "Black" },
        { name: "Nike Dri-FIT Polo", qty: 20, size: "L", color: "Black" },
      ],
    },
  },
  {
    id: "VJ-004", source: "email", subject: "Re: Updated quantities",
    customer: "TechCorp Inc.", receivedAt: "2026-03-03 14:10",
    status: "pushed",
    extractedFields: {
      poNumber: "TC-2290", dueDate: "2026-03-20",
      items: [
        { name: "Bella+Canvas 3001 Tee", qty: 500, size: "Mixed", color: "Heather Grey" },
      ],
    },
  },
  {
    id: "VJ-005", source: "email", subject: "New order — need ASAP",
    customer: "Downtown Dental", receivedAt: "2026-03-04 10:02",
    status: "pending",
  },
];

const SOURCE_ICON: Record<string, React.ElementType> = { email: Mail, pdf: FileText, photo: Image };

export default function AIVisionJobs() {
  const [selected, setSelected] = useState<VisionJob | null>(null);
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_JOBS.filter((j) => {
    if (filter !== "all" && j.status !== filter) return false;
    if (search && !j.subject.toLowerCase().includes(search.toLowerCase()) && !j.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Vision Jobs</h1>
        <p className="text-muted-foreground text-sm">Incoming documents processed by the AI Vision agent</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(["all", "pending", "extracting", "needs_review", "approved", "pushed"] as const).map((s) => {
          const count = s === "all" ? MOCK_JOBS.length : MOCK_JOBS.filter((j) => j.status === s).length;
          const cfg = s === "all" ? null : STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg border p-3 text-left transition-colors ${filter === s ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
            >
              <p className="text-xs text-muted-foreground capitalize">{s === "all" ? "All Jobs" : cfg!.label}</p>
              <p className="text-2xl font-bold">{count}</p>
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
              <Input
                placeholder="Search by subject or customer…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs h-8 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
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
                  const cfg = STATUS_CONFIG[job.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <TableRow
                      key={job.id}
                      className={`cursor-pointer ${selected?.id === job.id ? "bg-muted" : ""}`}
                      onClick={() => setSelected(job)}
                    >
                      <TableCell><SourceIcon className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-medium">
                        {job.subject}
                        {job.errorFlag && <AlertTriangle className="inline ml-1 h-3.5 w-3.5 text-destructive" />}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{job.customer}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{job.receivedAt}</TableCell>
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
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No jobs match your filter</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail panel */}
        {selected && (
          <Card className="w-full lg:w-[380px] shrink-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{selected.id}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
              </div>
              <CardDescription>{selected.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{selected.customer}</p></div>
                <div><p className="text-muted-foreground text-xs">Source</p><p className="font-medium capitalize">{selected.source}</p></div>
                <div><p className="text-muted-foreground text-xs">Received</p><p className="font-medium">{selected.receivedAt}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={STATUS_CONFIG[selected.status].className}>{STATUS_CONFIG[selected.status].label}</Badge>
                </div>
              </div>

              {selected.errorFlag && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-destructive text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Error Flag</p>
                    <p>{selected.errorFlag}</p>
                  </div>
                </div>
              )}

              {selected.extractedFields && (
                <div className="space-y-2">
                  <p className="font-medium">Extracted Fields</p>
                  {selected.extractedFields.poNumber && <p className="text-xs text-muted-foreground">PO: {selected.extractedFields.poNumber}</p>}
                  {selected.extractedFields.dueDate && <p className="text-xs text-muted-foreground">Due: {selected.extractedFields.dueDate}</p>}
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
                      {selected.extractedFields.items.map((item, i) => (
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
                    <Button size="sm" className="flex-1"><CheckCircle2 className="mr-1 h-3 w-3" />Approve</Button>
                  </>
                )}
                {selected.status === "approved" && (
                  <Button size="sm" className="flex-1"><Send className="mr-1 h-3 w-3" />Push to Printavo</Button>
                )}
                {selected.status === "pending" && (
                  <Button size="sm" variant="outline" className="flex-1"><RotateCcw className="mr-1 h-3 w-3" />Re-process</Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
