"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { 
  Check, 
  Zap, 
  Crown, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Star,
  ChevronRight
} from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>("FREE");

  useEffect(() => {
    setMounted(true);
    if (isSignedIn) {
      fetch('/api/credits')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setCredits(data.credits);
            setPlan(data.plan);
          }
        })
        .catch(() => {});
    }
  }, [isSignedIn]);

  if (!mounted || !isLoaded) return <div className="h-16" />;

  return (
    <nav className="fixed top-0 left-0 right-0 h-[64px] bg-white/70 backdrop-blur-xl z-50 border-b border-zinc-100/50 shadow-sm px-6">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-[18px] font-bold tracking-tight">Lumina</span>
        </Link>

        <div className="flex items-center gap-6">
          {isSignedIn && credits !== null && (
            <div className="hidden md:flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full">
              <span className="text-[12px] font-bold text-zinc-900">{credits} Credits</span>
              <span className="text-[10px] font-black bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-md uppercase tracking-wider">{plan}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link 
                  href="/studio" 
                  className="text-[13px] font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 overflow-hidden border border-zinc-200 shadow-inner group-hover/user:scale-105 transition-all">
                  <UserButton />
                </div>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="text-[13px] font-semibold bg-black text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const plans = [
  {
    id: "FREE",
    name: "Free",
    tagline: "Try it out",
    price: 0,
    currency: "₹",
    period: "forever",
    credits: 10,
    icon: Sparkles,
    features: [
      "10 AI generations",
      "All studio types",
      "Standard resolution",
      "3 AI models",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
    lightBg: "bg-white",
    dark: false,
  },
  {
    id: "STARTER",
    name: "Starter",
    tagline: "For growing brands",
    price: 999,
    currency: "₹",
    period: "month",
    credits: 75,
    pricePerImage: "≈ ₹13.3 per image",
    icon: Zap,
    features: [
      "75 AI generations / month",
      "All studio types",
      "HD resolution output",
      "15+ AI models",
      "AI Fix Canvas",
      "Priority email support",
      "Generation history",
    ],
    cta: "Start Selling",
    popular: true,
    lightBg: "bg-white",
    dark: false,
    featured: true, // Use a new flag for the 'Most Popular' highlighting
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "For serious sellers",
    price: 2999,
    currency: "₹",
    period: "month",
    credits: 300,
    pricePerImage: "≈ ₹10.0 per image",
    icon: Crown,
    features: [
      "300 AI generations / month",
      "All Starter features",
      "Ultra-HD 4K output",
      "Batch generation (4 shots)",
      "Custom model training",
      "Saree specialist engine",
      "API access",
    ],
    cta: "Go Pro",
    popular: false,
    lightBg: "bg-white",
    dark: false,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    tagline: "For large catalogues",
    price: null,
    currency: "₹",
    period: "custom",
    credits: null,
    icon: Building2,
    features: [
      "Unlimited generations",
      "All Pro features",
      "White-label solution",
      "Custom AI model fine-tuning",
      "Dedicated GPU cluster",
      "99.9% SLA guarantee",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
    lightBg: "bg-white",
    dark: false,
  },
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-20">
            <p className="text-[12px] font-black uppercase tracking-[.3em] text-indigo-500/80 mb-6">Subscription Plans</p>
            <h1 className="text-[40px] md:text-[64px] font-extrabold tracking-tight leading-[1.05] mb-8 text-zinc-950">
              Simple, transparent pricing.
            </h1>
            <p className="text-[18px] text-premium-secondary max-w-xl mx-auto font-medium">
              Start free. Scale as your catalogue grows. No hidden fees, no surprises.
            </p>
          </FadeIn>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <FadeIn key={plan.id} delay={idx * 0.1} className={`rounded-[32px] border p-10 flex flex-col hover:shadow-elite transition-all duration-500 relative group h-full ${
                  plan.id === "STARTER" 
                  ? "bg-white border-indigo-200 shadow-elite ring-[12px] ring-indigo-50/30 scale-[1.02] z-10" 
                  : "bg-white border-zinc-100 text-zinc-900 shadow-premium hover:border-indigo-100"
                }`}>
                  {plan.id === "STARTER" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent rounded-[32px] pointer-events-none" />
                  )}

                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-indigo-200 border border-indigo-500 ring-4 ring-white">
                      Recommended
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div className="flex items-center gap-4 mb-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                      plan.id === "STARTER" ? "bg-indigo-600 shadow-xl shadow-indigo-200" : "bg-zinc-50 border border-zinc-100"
                    }`}>
                      <Icon className={`w-6 h-6 ${plan.id === "STARTER" ? "text-white" : "text-zinc-400"}`} />
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase tracking-[.2em] font-black mb-1 ${
                        plan.id === "STARTER" ? "text-indigo-600" : "text-zinc-400"
                      }`}>{plan.tagline}</p>
                      <h3 className="text-[20px] font-black tracking-tight text-zinc-950 uppercase">{plan.name}</h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-5xl font-black text-zinc-950 tracking-tighter">
                      {plan.price === null ? "Custom" : `${plan.currency}${plan.price.toLocaleString()}`}
                    </span>
                    {plan.price !== null && (
                      <span className={`text-[13px] ml-2 text-premium-muted font-bold uppercase tracking-wider`}>
                        {plan.id === "FREE" ? "forever" : "/ mo"}
                      </span>
                    )}
                  </div>
                  
                  {plan.credits !== null && (
                    <p className="text-[14px] mb-1 text-premium-secondary font-bold">
                      {plan.credits} AI generations total
                    </p>
                  )}
                  {plan.pricePerImage && (
                    <p className="text-[12px] mb-10 text-premium-muted font-medium">
                      {plan.pricePerImage}
                    </p>
                  )}
                  {!plan.pricePerImage && <div className="mb-10" />}

                  {/* CTA */}
                  <button
                    onClick={() => {
                      if (plan.id === "FREE") router.push("/sign-up");
                      else if (plan.id === "ENTERPRISE") router.push("mailto:hello@luminapro.ai");
                      else router.push(`/sign-up?plan=${plan.id}`);
                    }}
                    className={`w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-[.2em] transition-all mb-10 shadow-lg active:scale-95 ${
                      plan.id === "STARTER"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200/50"
                      : "bg-zinc-950 text-white hover:bg-black shadow-zinc-200"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Divider */}
                  <div className={`border-t mb-8 ${plan.dark ? "border-white/10" : "border-zinc-100"}`} />

                  {/* Features */}
                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
                        <span className="text-[13px] leading-snug text-premium-secondary font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              );
            })}
          </div>

          {/* Footer Info */}
          <FadeIn delay={0.5} className="mt-24 text-center border-t border-zinc-100/50 pt-12">
            <p className="text-[13px] text-premium-muted max-w-lg mx-auto leading-relaxed font-medium transition-colors hover:text-premium-secondary">
              All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA. 
              <br />
              <span className="font-bold text-indigo-500/80">No credit card required for Free plan.</span>
            </p>
          </FadeIn>
        </div>
      </main>

      {/* Trust section from homepage */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100 mt-12">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-12 text-premium-secondary">
            {["10,000+ brands trust us", "50M+ images generated", "Average 4.9★ rating", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-[14px] font-extrabold uppercase tracking-widest text-zinc-950/40 hover:text-indigo-600 transition-colors cursor-default">
                <Check className="w-4 h-4 text-indigo-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
