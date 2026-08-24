import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, CheckCircle2, Clock, Loader2, Video } from "lucide-react";

interface DaySlots {
  date: string;
  slots: string[];
}

const BROWSER_TZ =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";

const formatDayLabel = (date: string, timezone: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone,
  }).format(new Date(`${date}T12:00:00Z`));

const formatTime = (iso: string, timezone: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(iso));

export default function Demo() {
  const { toast } = useToast();
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [timezone, setTimezone] = useState(BROWSER_TZ);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ when: string; timezone: string } | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    notes: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingSlots(true);
      setSlotError(null);
      const { data, error } = await supabase.functions.invoke("ghl-calendar", {
        body: null,
        method: "GET",
      });
      if (cancelled) return;
      if (error || (data as { error?: string })?.error) {
        setSlotError("We couldn't load live availability right now.");
        setLoadingSlots(false);
        return;
      }
      const payload = data as { timezone?: string; days?: DaySlots[] };
      setDays(payload.days ?? []);
      if (payload.timezone) setTimezone(payload.timezone);
      setActiveDate(payload.days?.[0]?.date ?? null);
      setLoadingSlots(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSlots = useMemo(
    () => days.find((d) => d.date === activeDate)?.slots ?? [],
    [days, activeDate],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast({ title: "Pick a time", description: "Choose an available time slot first.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("book-demo", {
      body: { ...form, slot: selectedSlot, timezone },
    });
    setSubmitting(false);

    const payload = data as { success?: boolean; when?: string; timezone?: string; error?: string } | null;
    if (error || !payload?.success) {
      toast({
        title: "Booking failed",
        description: payload?.error ?? "Please try another time slot or email us.",
        variant: "destructive",
      });
      return;
    }
    setConfirmed({ when: payload.when ?? "", timezone: payload.timezone ?? timezone });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Book a 15-Minute Demo | Brand-Shop.AI"
        description="Book a 15-minute Zoom discovery call with Brand-Shop.AI. See AI-built storefronts, automated order routing, and 24/7 AI support for apparel distributors."
        path="/demo"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Book a demo — Brand-Shop.AI",
          description:
            "Schedule a 15-minute Zoom discovery call to see AI-powered custom apparel storefronts in action.",
          url: "https://brand-shop.ai/demo",
        }}
      />
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
              15-minute Zoom discovery call
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Book a demo of <span className="text-primary">Brand-Shop.AI</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Pick a time that works, and we'll walk through AI-built storefronts, automated order
              routing, and 24/7 AI support for your accounts.
            </p>
          </div>

          {confirmed ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-10 text-center">
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">You're booked</h2>
                <p className="text-muted-foreground mb-6">
                  {confirmed.when} ({confirmed.timezone}). A confirmation email and text are on their
                  way, plus reminders 48 hours, 24 hours, and 1 hour before we meet.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button asChild className="rounded-full">
                    <Link to="/assessment">See how much you can save</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/blog">Read the blog</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-[1fr_1fr] gap-8 max-w-5xl mx-auto">
              {/* Slot picker */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Choose a time</h2>
                  </div>

                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading availability…
                    </div>
                  ) : slotError || days.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8">
                      {slotError ?? "No times are open in the next two weeks."} Send your details and
                      we'll reach out with times — or email{" "}
                      <a className="text-primary underline" href="mailto:hello@brand-shop.ai">
                        hello@brand-shop.ai
                      </a>
                      .
                    </p>
                  ) : (
                    <>
                      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                        {days.map((d) => (
                          <button
                            key={d.date}
                            type="button"
                            onClick={() => {
                              setActiveDate(d.date);
                              setSelectedSlot(null);
                            }}
                            className={`shrink-0 px-4 py-2 rounded-full border text-sm transition-colors ${
                              activeDate === d.date
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {formatDayLabel(d.date, timezone)}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
                        {activeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                              selectedSlot === slot
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {formatTime(slot, timezone)}
                          </button>
                        ))}
                      </div>

                      <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Times shown in {timezone}
                      </p>
                    </>
                  )}

                  <div className="mt-6 pt-6 border-t border-border flex items-start gap-3">
                    <Video className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      15 minutes on Zoom. You'll get the link by email right after booking.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Details form */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Your details</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          required
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Work email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Mobile number (for text reminders)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+1 555 123 4567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="role">Your role</Label>
                        <Input
                          id="role"
                          placeholder="Distributor, decorator…"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="notes">What would you like to see?</Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>

                    {selectedSlot && (
                      <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm">
                        Selected:{" "}
                        <strong>
                          {formatDayLabel(selectedSlot.slice(0, 10), timezone)} at{" "}
                          {formatTime(selectedSlot, timezone)}
                        </strong>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking…
                        </>
                      ) : (
                        "Confirm my demo"
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      We'll text and email your confirmation, then remind you 48h, 24h, and 1h before.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
