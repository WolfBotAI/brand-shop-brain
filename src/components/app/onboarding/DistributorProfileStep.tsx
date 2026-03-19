import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBubble } from "@/components/features/ChatBubble";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface DistributorProfileStepProps {
  onNext: (data: { businessName: string; phone: string; website: string; logoUrl: string | null }) => void;
  onBack: () => void;
}

export const DistributorProfileStep = ({ onNext, onBack }: DistributorProfileStepProps) => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);
      setLogoUrl(publicUrl);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleNext = async () => {
    if (!businessName.trim()) return;
    setSaving(true);
    try {
      if (user) {
        const tenantId = `tenant-${user.id.slice(0, 8)}`;
        await supabase
          .from("profiles")
          .update({
            business_name: businessName.trim(),
            tenant_id: tenantId,
            phone: phone.trim() || null,
            website: website.trim() || null,
            company_logo_url: logoUrl,
          } as any)
          .eq("id", user.id);
        refreshProfile();
      }
      onNext({ businessName: businessName.trim(), phone, website, logoUrl });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Distributor Profile</h2>
            <p className="text-muted-foreground">Tell us about your business</p>
          </div>
        </div>
      </div>

      <ChatBubble
        message="Let's set up your distributor account. This information will appear on your client stores and invoices."
        delay={0.2}
      />

      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              placeholder="e.g. Acme Apparel Distributors"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourcompany.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Company Logo</Label>
            {logoUrl ? (
              <div className="flex items-center gap-4">
                <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-border" />
                <Button variant="ghost" size="sm" onClick={() => setLogoUrl(null)}>
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload logo</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={handleNext} disabled={!businessName.trim() || saving} className="flex-1 gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
