"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Zap, Crown, Building2, Sparkles, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

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
    color: "zinc",
    gradient: "from-zinc-800 to-zinc-900",
    border: "border-white/10",
    features: [
      "10 AI generations",
      "Apparel & Jewellery studio",
      "Standard resolution output",
      "Basic model library (3 models)",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
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
    color: "indigo",
    gradient: "from-indigo-600/20 to-violet-600/10",
    border: "border-indigo-500/50",
    features: [
      "100 AI generations / month",
      "All studio types (Apparel, Jewellery, Home, Pets)",
      "HD resolution output",
      "Full model library (15+ models)",
      "AI Fix Canvas (inpainting)",
      "Priority email support",
      "Generation history",
    ],
    cta: "Start Selling",
    popular: true,
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
    color: "amber",
    gradient: "from-amber-500/20 to-orange-600/10",
    border: "border-amber-500/40",
    features: [
      "500 AI generations / month",
      "All Starter features",
      "Ultra-HD 4K output",
      "Batch generation (4 shots at once)",
      "Custom model training",
      "Saree & ethnic wear specialist",
      "Dedicated Slack support",
      "API access",
    ],
    cta: "Go Pro",
    popular: false,
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
    color: "cyan",
    gradient: "from-cyan-500/10 to-teal-600/10",
    border: "border-cyan-500/30",
    features: [
      "Unlimited AI generations",
      "All Pro features",
      "White-label solution",
      "Custom AI model fine-tuning",
      "Dedicated GPU cluster",
      "SLA guarantee (99.9% uptime)",
      "Dedicated account manager",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PLAN_CREDITS = {
  FREE: 10,
  STARTER: 100,
  PRO: 500,
  ENTERPRISE: 999999,
};

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const annualDiscount = 0.2; // 20% off

  const getDisplayPrice = (price: number | null) => {
    if (price === null) return "Custom";
    if (price === 0) return "₹0";
    const displayPrice = billingCycle === "annual" ? Math.round(price * (1 - annualDiscount)) : price;
    return `₹${displayPrice.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">Lumina<span className="text-indigo-400 italic">Pro</span></span>
        </Link>
        <Link href="/studio" className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-black text-sm font-bold hover:bg-neutral-100 transition-all">
          Open Studio <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Header */}
      <div className="relative z-10 text-center pt-20 pb-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
          <Star className="w-3.5 h-3.5" /> Simple, transparent pricing
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6">
          Pay for what you<br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">actually use</span>
        </h1>
        <p className="text-zinc-400 text-xl max-w-xl mx-auto mb-10">
          Start free. Scale as your catalogue grows. No hidden fees, no surprises.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-zinc-900 border border-white/5">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === "annual" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
          >
            Annual
            <span className={`text-xs px-2 py-0.5 rounded-full font-black ${billingCycle === "annual" ? "bg-indigo-600 text-white" : "bg-indigo-500/20 text-indigo-400"}`}>-20%</span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-[32px] border p-8 flex flex-col bg-gradient-to-b ${plan.gradient} ${plan.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${plan.popular ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#030303]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30">
                    Most Popular
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    plan.color === "indigo" ? "bg-indigo-500/20" :
                    plan.color === "amber" ? "bg-amber-500/20" :
                    plan.color === "cyan" ? "bg-cyan-500/20" : "bg-white/5"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      plan.color === "indigo" ? "text-indigo-400" :
                      plan.color === "amber" ? "text-amber-400" :
                      plan.color === "cyan" ? "text-cyan-400" : "text-zinc-400"
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{plan.tagline}</p>
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black">{getDisplayPrice(plan.price)}</span>
                    {plan.price !== null && plan.price > 0 && (
                      <span className="text-zinc-500 text-sm font-medium mb-1">/ {billingCycle === "annual" ? "mo, billed yearly" : "month"}</span>
                    )}
                  </div>
                  {plan.credits !== null && (
                    <p className="text-sm text-zinc-400 mt-1">
                      <span className="text-white font-bold">{plan.credits}</span> AI generations {plan.id !== "FREE" ? "/ month" : "total"}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    if (plan.id === "FREE") router.push("/sign-up");
                    else if (plan.id === "ENTERPRISE") router.push("mailto:hello@luminapro.ai");
                    else router.push(`/sign-up?plan=${plan.id}`);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all mb-8 ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : plan.color === "amber"
                      ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Divider */}
                <div className="border-t border-white/5 mb-6" />

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.color === "indigo" ? "bg-indigo-500/20" :
                        plan.color === "amber" ? "bg-amber-500/20" :
                        plan.color === "cyan" ? "bg-cyan-500/20" : "bg-white/5"
                      }`}>
                        <Check className={`w-3 h-3 ${
                          plan.color === "indigo" ? "text-indigo-400" :
                          plan.color === "amber" ? "text-amber-400" :
                          plan.color === "cyan" ? "text-cyan-400" : "text-zinc-400"
                        }`} />
                      </div>
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ / Trust section */}
        <div className="mt-20 text-center">
          <p className="text-zinc-600 text-sm">
            All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA. &nbsp;
            <span className="text-zinc-400">No credit card required for Free plan.</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {["10,000+ brands trust us", "50M+ images generated", "Average 4.9★ rating", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-zinc-500">
                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
