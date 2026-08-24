import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import brandLogo from "@/assets/brand-logo.png";
import { SEO } from "@/components/seo/SEO";

const forgotSeo = (
  <SEO
    title="Reset Your Password | Brand-Shop.AI"
    description="Request a secure password reset link for your Brand-Shop.AI distributor account and get back to managing your storefronts."
    path="/forgot-password"
    noIndex
  />
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        {forgotSeo}
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h1 className="text-2xl font-semibold leading-none tracking-tight">Check your email</h1>
            <CardDescription>We sent a password reset link to <strong>{email}</strong>.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to="/login" className="text-primary hover:underline text-sm">Back to login</Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      {forgotSeo}
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <img src={brandLogo} alt="Brand-Shop.AI" className="h-8 mx-auto" />
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Reset your Brand-Shop.AI password</h1>
          <CardDescription>Enter your email and we'll send a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link to="/login" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
