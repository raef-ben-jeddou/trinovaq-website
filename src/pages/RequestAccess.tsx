import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck, Cpu, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const RequestAccess = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;

    try {
      const { error } = await supabase
        .from('leads') // Ensure this table exists in your Supabase
        .insert([{ email, company, role, interest_level: 'pilot' }]);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Application received securely.");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/20 via-background to-background -z-10" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio
        </Link>

        {!submitted ? (
          <Card className="glass-panel border-white/10">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-heading tracking-tight">Early Access Program</CardTitle>
              <CardDescription>
                TrinovaQ Studio is currently in closed beta for select automotive partners.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" placeholder="name@company.com" required className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" type="text" placeholder="OEM / Tier-1 Supplier" required className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" type="text" placeholder="e.g. Embedded Security Engineer" required className="bg-background/50 border-white/10" />
                </div>
                
                <Button type="submit" className="w-full bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-semibold mt-4">
                  Request Access
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel border-brand-cyan/30">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-cyan/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-heading text-white">Request Received</h3>
              <p className="text-muted-foreground">
                Our engineering team will review your application. If selected for the Q3 Pilot, you will receive a secure onboarding link.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-6 text-xs text-muted-foreground pt-4">
          <div className="flex items-center gap-1"><Lock className="w-3 h-3" /> ISO 21434 Compliant</div>
          <div className="flex items-center gap-1"><Cpu className="w-3 h-3" /> ASIL D Ready</div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;