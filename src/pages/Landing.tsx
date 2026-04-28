import {
  ArrowRight,
  Bell,
  Bot,
  Boxes,
  Brain,
  ChartNoAxesCombined,
  Database,
  LineChart,
  Newspaper,
  Shield,
  Zap,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SplitOnScroll = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;  

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`split-scroll-section ${visible ? "is-visible" : ""} ${className}`}>
      <div className="split-scroll-content">{children}</div>
      <div className="split-scroll-curtain split-scroll-curtain-left" />
      <div className="split-scroll-curtain split-scroll-curtain-right" />
    </section>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <div className="landing-curtain-stage fixed inset-0 z-50 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-1/2 landing-curtain-left bg-[linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--card)))] border-r border-border/70" />
        <div className="absolute inset-y-0 right-0 w-1/2 landing-curtain-right bg-[linear-gradient(225deg,hsl(var(--secondary)),hsl(var(--card)))] border-l border-border/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-base md:text-lg tracking-[0.35em] uppercase text-primary/90 mb-2">Welcome</p>
            <p className="text-2xl md:text-3xl font-semibold">InvestX Financial Intelligence</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,hsl(var(--primary)/0.14),transparent_45%),radial-gradient(circle_at_88%_8%,hsl(var(--success)/0.12),transparent_35%),radial-gradient(circle_at_50%_80%,hsl(var(--accent)/0.12),transparent_40%)]" />

      <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold leading-none">InvestX</h1>
              <p className="text-xs text-muted-foreground">Financial Intelligence</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary/50"
            >
              Login
            </Link>
            <Link
              to="/login?mode=register"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        <section className="grid lg:grid-cols-2 gap-10 items-center landing-reveal-1">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" /> Real-time Multi-Agent Intelligence
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Smart Investment and Portfolio Management Orchestrator
            </h2>
            <p className="text-muted-foreground text-lg">
              InvestX is a decision-assistance platform for investors. It continuously observes global markets,
              evaluates risk exposure, tracks financial news, and issues live alerts so you can make faster,
              better-informed portfolio actions.
            </p>
            <div className="flex gap-3">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border font-medium"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 landing-reveal-2">
            <img
              src="/landing/hero-dashboard.svg"
              alt="InvestX dashboard preview"
              className="w-full h-52 object-cover rounded-lg border border-border/60"
            />
            <h3 className="font-semibold text-lg">What this application does</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>1. Ingest live stock, crypto, forex, and macro signals from APIs.</li>
              <li>2. Run agent workflows for trend analysis, risk scoring, and rebalancing.</li>
              <li>3. Produce explainable reports with rationale behind each suggestion.</li>
              <li>4. Trigger real-time alerts for anomalies, reversals, and risk spikes.</li>
              <li>5. Keep user decisions transparent through structured insight history.</li>
            </ul>
            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Goal: reduce decision latency and improve risk-adjusted outcomes.
            </div>
          </div>
        </section>

        <SplitOnScroll>
          <h3 className="text-2xl font-semibold mb-6">Platform Experience</h3>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass-card p-5">
              <img
                src="/landing/mobile-alerts.svg"
                alt="Live mobile alert screen"
                className="w-full h-56 object-cover rounded-lg border border-border/60 mb-4"
              />
              <p className="font-medium mb-1">Always-On Alert Feed</p>
              <p className="text-sm text-muted-foreground">
                Receive anomaly, trend reversal, and risk notifications in a single flow from all active agents.
              </p>
            </div>
            <div className="glass-card p-5">
              <img
                src="/landing/risk-board.svg"
                alt="Risk and exposure analytics dashboard"
                className="w-full h-56 object-cover rounded-lg border border-border/60 mb-4"
              />
              <p className="font-medium mb-1">Risk-first Decision Layer</p>
              <p className="text-sm text-muted-foreground">
                Portfolio risk posture is continuously measured with VaR, Sharpe behavior, and concentration mapping.
              </p>
            </div>
          </div>
        </SplitOnScroll>

        <SplitOnScroll>
          <h3 className="text-2xl font-semibold mb-6">Core Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <LineChart className="w-5 h-5 text-primary mb-3" />
              <p className="font-medium mb-1">Market Intelligence</p>
              <p className="text-sm text-muted-foreground">Live stock and crypto trend analysis.</p>
            </div>
            <div className="glass-card p-5">
              <Shield className="w-5 h-5 text-primary mb-3" />
              <p className="font-medium mb-1">Risk Monitoring</p>
              <p className="text-sm text-muted-foreground">VaR, Sharpe ratio, and exposure checks.</p>
            </div>
            <div className="glass-card p-5">
              <Newspaper className="w-5 h-5 text-primary mb-3" />
              <p className="font-medium mb-1">News Intelligence</p>
              <p className="text-sm text-muted-foreground">Financial sentiment and event detection.</p>
            </div>
            <div className="glass-card p-5">
              <Bell className="w-5 h-5 text-primary mb-3" />
              <p className="font-medium mb-1">Live Alerts</p>
              <p className="text-sm text-muted-foreground">Instant agent notifications in the app.</p>
            </div>
          </div>
        </SplitOnScroll>

        <SplitOnScroll>
          <h3 className="text-2xl font-semibold mb-6">How The Agent System Works</h3>
          <img
            src="/landing/agents-flow.svg"
            alt="Multi-agent orchestration flow chart"
            className="w-full h-64 md:h-72 object-cover rounded-xl border border-border/60 mb-5"
          />
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <Database className="w-5 h-5 text-primary mb-3" />
              <p className="font-medium mb-1">1. Data Ingestion Layer</p>
              <p className="text-sm text-muted-foreground">
                Market and news streams are collected continuously and pushed into rolling memory.
              </p>
            </div>
            <div className="glass-card p-5">
              <Brain className="w-5 h-5 text-primary mb-3" />
              <p className="font-medium mb-1">2. Intelligence Layer</p>
              <p className="text-sm text-muted-foreground">
                Trend, risk, and rebalancing agents collaborate through an orchestrator and event bus.
              </p>
            </div>
            <div className="glass-card p-5">
              <Boxes className="w-5 h-5 text-primary mb-3" />
              <p className="font-medium mb-1">3. Action Layer</p>
              <p className="text-sm text-muted-foreground">
                Insights and alerts are delivered to dashboard notifications for immediate execution.
              </p>
            </div>
          </div>
        </SplitOnScroll>

        <SplitOnScroll>
          <h3 className="text-2xl font-semibold mb-6">Who This Is For</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <p className="font-medium mb-2">Retail Investors</p>
              <p className="text-sm text-muted-foreground">
                Consolidate market signals and reduce reaction time during volatile sessions.
              </p>
            </div>
            <div className="glass-card p-5">
              <p className="font-medium mb-2">Portfolio Managers</p>
              <p className="text-sm text-muted-foreground">
                Track portfolio drift, risk exposure, and rebalancing opportunities in one command center.
              </p>
            </div>
            <div className="glass-card p-5">
              <p className="font-medium mb-2">Research Teams</p>
              <p className="text-sm text-muted-foreground">
                Run repeatable, explainable workflows for testing market hypotheses and alert strategies.
              </p>
            </div>
          </div>
        </SplitOnScroll>

        <SplitOnScroll>
          <div className="glass-card p-7 md:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Deployment Vision</p>
                <h3 className="text-2xl font-semibold mb-3">Scalable, Event-Driven Architecture</h3>
                <p className="text-muted-foreground text-sm leading-6">
                  Backend services run in containers with FastAPI orchestrator control, Redis and vector memory for
                  context, and optional cloud scaling to handle market-peak workloads.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-secondary/40 border border-border/60 p-3">
                  <p className="font-medium mb-1">Backend</p>
                  <p className="text-muted-foreground">FastAPI microservices</p>
                </div>
                <div className="rounded-lg bg-secondary/40 border border-border/60 p-3">
                  <p className="font-medium mb-1">Memory</p>
                  <p className="text-muted-foreground">Redis + Vector DB</p>
                </div>
                <div className="rounded-lg bg-secondary/40 border border-border/60 p-3">
                  <p className="font-medium mb-1">Comms</p>
                  <p className="text-muted-foreground">Pub/Sub events</p>
                </div>
                <div className="rounded-lg bg-secondary/40 border border-border/60 p-3">
                  <p className="font-medium mb-1">Frontend</p>
                  <p className="text-muted-foreground">React investor dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </SplitOnScroll>

        <SplitOnScroll className="pb-8">
          <div className="rounded-2xl border border-primary/30 bg-[linear-gradient(135deg,hsl(var(--primary)/0.14),hsl(var(--accent)/0.10),transparent)] p-8 text-center">
            <ChartNoAxesCombined className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-semibold mb-2">Ready to run your first intelligent portfolio cycle?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create an account, connect your strategy, and let the agent pipeline monitor your portfolio continuously.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </SplitOnScroll>
      </main>
    </div>
  );
};

export default Landing;
