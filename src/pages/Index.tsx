import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-cyan selection:text-brand-dark">
      <Header />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-purple/20 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-brand-cyan/10 blur-[100px] rounded-full -z-10" />

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-xs font-mono text-brand-cyan tracking-wide">V1.0 ALPHA // PILOT PROGRAM OPEN</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 animate-fade-in [animation-delay:200ms]">
            The IDE for the <br />
            <span className="text-gradient-cyan">Software-Defined Vehicle</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in [animation-delay:400ms]">
            Write ASIL D compliant code from day one. TrinovaQ Studio integrates ISO 26262, MISRA C, and ISO 21434 checks directly into your development workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:600ms]">
            <Button asChild size="lg" className="bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-semibold h-12 px-8 text-base">
              <Link to="/request-access">
                Request Early Access <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 h-12 px-8 text-base">
              <Link to="/technology">View Architecture</Link>
            </Button>
          </div>
          
      {/* TRUST / STANDARDS SECTION */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-mono text-muted-foreground mb-8 uppercase tracking-widest">
            Engineered for Compliance Standards
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* You can replace these text blocks with actual SVGs later */}
            <div className="flex items-center gap-2 text-xl font-bold font-heading text-white">
              ISO<span className="text-brand-cyan">26262</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-heading text-white">
              ISO<span className="text-brand-purple">21434</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-heading text-white">
              MISRA <span className="text-white/60">C:2012</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-heading text-white">
              UN <span className="text-brand-cyan">R155</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-heading text-white">
              CERT <span className="text-brand-purple">C</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* FEATURES GRID */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              Compliance is no longer an <span className="text-gradient-purple">afterthought</span>.
            </h2>
            <p className="text-muted-foreground text-lg">
              TrinovaQ shifts safety and security left. We analyze your firmware AST in real-time, detecting violations before they ever reach the build server.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Real-time Analysis */}
            <div className="col-span-1 md:col-span-2 row-span-2 glass-panel p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Terminal className="w-24 h-24 text-brand-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Real-Time Static Analysis</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Forget waiting for nightly CI/CD reports. Our engine parses MISRA C and CERT C rules as you type, highlighting vulnerabilities with <span className="text-brand-cyan">millisecond latency</span>.
              </p>
              {/* Abstract Visual */}
              <div className="w-full h-48 bg-brand-dark/50 rounded-lg border border-white/10 p-4 font-mono text-xs text-gray-400">
                 <div className="flex gap-2 mb-2"><span className="text-red-500">>></span> <span>Scanning src/drivers/can_bus.c...</span></div>
                 <div className="flex gap-2 mb-2"><span className="text-yellow-500">[WARN]</span> <span>Rule 11.4: Cast between pointer and integer</span></div>
                 <div className="flex gap-2 mb-2"><span className="text-red-500">[CRIT]</span> <span>CWE-119: Buffer overflow detected in frame_buffer</span></div>
                 <div className="mt-4 flex gap-2 text-brand-cyan animate-pulse">
                    <span className="w-2 h-4 bg-brand-cyan block"></span> Analysis Complete.
                 </div>
              </div>
            </div>

            {/* Feature 2: TARA Integration */}
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-brand-purple">
              <h3 className="text-xl font-bold text-white mb-2">Native TARA Integration</h3>
              <p className="text-sm text-muted-foreground">
                Link code directly to Threat Analysis & Risk Assessment (TARA) items. Trace vulnerabilities from the silicon up to the requirement ID.
              </p>
            </div>

            {/* Feature 3: Flash Protection */}
            <div className="glass-panel p-8 rounded-2xl border-t-4 border-brand-cyan">
              <h3 className="text-xl font-bold text-white mb-2">Secure Flash Interlocks</h3>
              <p className="text-sm text-muted-foreground">
                Prevent unsigned binary deployment. Our SafeAction™ controller ensures 
                firmware signatures match the approved build hash before flashing.
              </p>
            </div>
          </div>
        </div>
      </section>

          {/* CODE PREVIEW (Mockup) */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-brand-dark/50 backdrop-blur-sm shadow-2xl overflow-hidden animate-fade-in [animation-delay:800ms]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 text-xs font-mono text-muted-foreground flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                main_safety_controller.c
              </div>
            </div>
            <div className="p-6 text-left font-mono text-sm overflow-x-auto">
              <div className="text-gray-400">
                <span className="text-brand-purple">#include</span> &lt;iso26262_safety.h&gt;<br/>
                <br/>
                <span className="text-brand-cyan">void</span> <span className="text-yellow-400">Safety_Monitor_Loop</span>(<span className="text-brand-cyan">void</span>) {'{'}<br/>
                &nbsp;&nbsp;<span className="text-gray-500">// MISRA C:2012 Rule 17.7 Compliance Check: OK</span><br/>
                &nbsp;&nbsp;<span className="text-brand-cyan">uint32_t</span> status = <span className="text-blue-400">Get_Sensor_Data</span>();<br/>
                &nbsp;&nbsp;<br/>
                &nbsp;&nbsp;<span className="text-brand-purple">if</span> (status &gt; SAFE_LIMIT) {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">// ASIL D Handler Triggered</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">Engage_Safe_State</span>();<br/>
                &nbsp;&nbsp;{'}'}<br/>
                {'}'}
              </div>
            </div>
            
            {/* Compliance Badge Overlay */}
            <div className="absolute bottom-4 right-4 bg-green-900/30 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> MISRA C: COMPLIANT
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER PLACEHOLDER */}
      <footer className="border-t border-white/10 py-12 text-center text-muted-foreground text-sm">
        <p>© 2026 TrinovaQ. Engineered for Critical Systems.</p>
      </footer>
    </div>
  );
};

export default Index;