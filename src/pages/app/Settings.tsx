import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Bell, Shield, Globe, Loader2, Copy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo/SEO";

export default function Settings() {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.business_name ?? "");
      setFullName(profile.full_name ?? "");
    }
  }, [profile]);

  const { data: stores } = useQuery({
    queryKey: ["settings-stores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stores").select("id, store_name, slug, custom_domain").order("store_name");
      if (error) throw error;
      return data as any[];
    },
  });

  const [domainInputs, setDomainInputs] = useState<Record<string, string>>({});
  const [savingDomain, setSavingDomain] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ business_name: businessName, full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Your profile has been updated." });
      refreshProfile();
    }
  };

  const handleSaveDomain = async (storeId: string) => {
    const domain = domainInputs[storeId]?.trim() || null;
    setSavingDomain(storeId);
    const { error } = await supabase.from("stores").update({ custom_domain: domain } as any).eq("id", storeId);
    setSavingDomain(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Custom domain updated." });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <SEO title="Settings | Brand-Shop.AI" description="Manage your Brand-Shop.AI account, profile, and platform preferences." path="/app/settings" noIndex />
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and platform preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email ?? ""} disabled />
          </div>
          {profile?.tenant_id && (
            <div className="grid gap-2">
              <Label>Tenant ID</Label>
              <Input value={profile.tenant_id} disabled />
            </div>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Custom Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />Custom Domains</CardTitle>
          <CardDescription>Map a custom domain to your stores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!stores?.length ? (
            <p className="text-sm text-muted-foreground">No stores yet.</p>
          ) : (
            stores.map((s) => (
              <div key={s.id} className="space-y-2 pb-3 border-b border-border last:border-0">
                <p className="text-sm font-medium">{s.store_name}</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="store.yourdomain.com"
                    defaultValue={s.custom_domain || ""}
                    onChange={(e) => setDomainInputs({ ...domainInputs, [s.id]: e.target.value })}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveDomain(s.id)}
                    disabled={savingDomain === s.id}
                  >
                    {savingDomain === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Add a CNAME record pointing to <code className="bg-muted px-1 rounded">lovable.app</code></p>
                  {s.slug && (
                    <p className="flex items-center gap-1">
                      Current URL: <code className="bg-muted px-1 rounded">/store/{s.slug}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/store/${s.slug}`); toast({ title: "Copied!" }); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</CardTitle>
          <CardDescription>Configure email and in-app notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" />Security</CardTitle>
          <CardDescription>Password and access controls</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Security settings coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
