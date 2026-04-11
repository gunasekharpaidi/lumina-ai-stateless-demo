"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shirt,
  Gem,
  Sofa,
  Dog,
  Users,
  Zap,
  Shield,
  Paintbrush,
  Camera,
  ChevronRight,
  GripVertical,
  Check,
  Crown,
  Building2,
} from "lucide-react";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const STUDIOS = [
  {
    id: "apparel",
    label: "Apparel",
    icon: Shirt,
    headline: "Western, Ethnic & Athleisure",
    body: "Upload a flat-lay, ghost mannequin, or garment photo. Our AI drapes it on any model — from luxury sarees to structured coats — preserving every stitch, pattern, and texture.",
    modes: ["Separates", "Dress", "Saree", "Flat Lay"],
    image: "/assets/landing/hero.png",
  },
  {
    id: "jewellery",
    label: "Jewellery",
    icon: Gem,
    headline: "Macro Precision for Every Carat",
    body: "Necklaces, rings, watches — staged with refractive accuracy. Our engine understands metallic sheen, diamond facets, and skin-tone interaction at a macro level.",
    modes: ["Necklace", "Ring", "Watch"],
    image: "/assets/landing/after_jewellery.png",
  },
  {
    id: "home",
    label: "Home & Decor",
    icon: Sofa,
    headline: "Stage Products in Luxury Interiors",
    body: "Place your furniture, lighting fixtures, or textiles into ray-traced professional environments instantly. No physical set dressing required.",
    modes: ["Furniture", "Decor", "Lighting"],
    image: "/assets/landing/after_home.png",
  },
  {
    id: "pets",
    label: "Pet Fashion",
    icon: Dog,
    headline: "The Luxury Pet Boutique Engine",
    body: "A specialized studio for pet-wear brands. Place your accessories on AI pet models with consistent breed features, fur texture, and natural lighting.",
    modes: ["Breed", "Outfit", "Accessory"],
    image: "/assets/landing/showcase_pets.png",
  },
];

const BEFORE_AFTER = [
  {
    category: "Apparel",
    label: "Flat lay → On model",
    before: "/assets/landing/before_flatlay.png",
    after: "/assets/landing/after_onmodel.png",
    desc: "Upload any flat-lay garment photo. Lumina generates a model wearing it — same fabric, same color, same pattern.",
  },
  {
    category: "Jewellery",
    label: "Product → Styled",
    before: "/assets/landing/v4_jewel_before.png",
    after: "/assets/landing/v4_jewel_after.png",
    desc: "Drop a product shot of any jewellery. Get an editorial-quality model wearing it — macro detail, natural skin interaction.",
  },
  {
    category: "Home",
    label: "Isolated → Staged",
    before: "/assets/landing/v5_home_before.png",
    after: "/assets/landing/v5_home_after.png",
    desc: "Upload a plain product photo. Lumina stages it in a professionally styled interior, complete with lighting and context.",
  },
  {
    category: "Pets",
    label: "Accessory → On model",
    before: "/assets/landing/v4_pets_before.png",
    after: "/assets/landing/v4_pets_after.png",
    desc: "Showcase your pet accessories on our AI models. Consistent fur textures, natural lighting, and perfect sizing.",
  },
];

const CAPABILITIES = [
  {
    icon: Users,
    title: "24 Neural DNA Models",
    body: "Lock in model identity across every SKU. Every persona — from infant to senior, across 6 ethnicities — maintains 100% facial and body consistency.",
  },
  {
    icon: Camera,
    title: "4-Shot Auto-Batch",
    body: "Generate Primary, Side, Pose, and Macro-Closeup shots in one click. Full catalog coverage from a single garment upload.",
  },
  {
    icon: Paintbrush,
    title: "AI Fix Canvas",
    body: "Not perfect? Paint over any area and describe the fix. Our inpainting engine corrects drape, pattern alignment, and lighting on demand.",
  },
  {
    icon: Zap,
    title: "4 Environment Modes",
    body: "Switch between Studio, Urban, Nature, and Luxury backdrops. Same garment, same model, four completely different editorial lookbooks.",
  },
  {
    icon: Shield,
    title: "Saree Master-Drape",
    body: "The only AI engine built to understand Zari borders, Pallu patterns, and the complex physics of Indian ethnic drapes with 1:1 fidelity.",
  },
  {
    icon: Sparkles,
    title: "Smart Validation",
    body: "Orientation-aware upload validation catches narrow folds and low-detail shots before generation, saving time and credits.",
  },
];



/* ═══════════════════════════════════════════
   BEFORE/AFTER SLIDER
   ═══════════════════════════════════════════ */

function BeforeAfterSlider({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setPosition(pct);
  };

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchend", handleUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-col-resize select-none bg-white"
      onMouseDown={(e) => {
        setIsDragging(true);
        updatePosition(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        updatePosition(e.touches[0].clientX);
      }}
    >
      {/* After (full background) */}
      <Image
        src={after}
        alt="After"
        fill
        className="object-cover"
        draggable={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
      />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt="Before"
          fill
          className="object-cover"
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white/90 z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-zinc-200 flex items-center justify-center">
          <GripVertical className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1.5 rounded-full z-20">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-zinc-900 text-[11px] font-medium px-3 py-1.5 rounded-full z-20">
        After
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANIMATION WRAPPER
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
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

import { useAuth, UserButton } from "@clerk/nextjs";

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
          setCredits(data.credits);
          setPlan(data.plan);
        })
        .catch(err => console.error("Error fetching credits:", err));
    }
  }, [isSignedIn]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 h-[60px]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[14px] font-bold tracking-tight">Lumina</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link href="#how-it-works" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">How it Works</Link>
          <Link href="#studios" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">Studios</Link>
          <Link href="#capabilities" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">Capabilities</Link>
          <Link href="#models" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">AI Models</Link>
          <Link href="#pricing" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          {(!mounted || !isLoaded) ? null : isSignedIn ? (
            <>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100 mr-2">
                <span className="text-[11px] font-bold text-zinc-900">{credits ?? 0} Credits</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                  plan === "PRO" ? "bg-amber-100 text-amber-600" :
                  plan === "STARTER" ? "bg-indigo-100 text-indigo-600" :
                  "bg-zinc-200 text-zinc-500"
                }`}>
                  {plan}
                </span>
              </div>
              <Link
                href="/studio"
                className="text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">Log in</Link>
              <Link
                href="/sign-up"
                className="bg-zinc-900 text-white text-[13px] font-medium px-5 py-2 rounded-full hover:bg-black transition-colors"
              >
                Open Studio
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function StudioCard({
  studio,
  isActive,
  onClick,
}: {
  studio: (typeof STUDIOS)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = studio.icon;
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 rounded-2xl border transition-all duration-300 w-full ${
        isActive
          ? "bg-indigo-50 text-indigo-900 border-indigo-200 shadow-md"
          : "bg-white border-zinc-100 hover:border-zinc-200 text-zinc-900 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-zinc-400"}`} />
        <span className="text-[13px] font-semibold">{studio.label}</span>
      </div>
      <p className={`text-[12px] leading-relaxed ${isActive ? "text-indigo-700/70" : "text-zinc-500"}`}>
        {studio.headline}
      </p>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 flex flex-wrap gap-1.5"
        >
          {studio.modes.map((m) => (
            <span
              key={m}
              className="text-[10px] bg-white border border-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full shadow-sm"
            >
              {m}
            </span>
          ))}
        </motion.div>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  const [activeStudio, setActiveStudio] = useState(0);
  const [activeBA, setActiveBA] = useState(0);
  const current = STUDIOS[activeStudio];
  const currentBA = BEFORE_AFTER[activeBA];

  return (
    <main className="bg-white text-zinc-900 overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="pt-[60px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[85vh] items-center">
            {/* text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-20 lg:pr-16"
            >
              <p className="text-[13px] text-zinc-400 font-medium mb-6 tracking-wide">
                AI Product Photography for Global Brands
              </p>
              <h1 className="text-[44px] md:text-[54px] leading-[1.08] tracking-tight mb-6">
                <span className="font-light text-zinc-400 italic block">
                  Every category.
                </span>
                <span className="font-semibold block">
                  Every model. Every shot.
                </span>
                <span className="font-semibold block">One studio.</span>
              </h1>
              <p className="text-[16px] text-zinc-500 leading-relaxed max-w-[420px] mb-10">
                From apparel to jewellery, home decor to pet fashion — Lumina
                generates catalog-ready editorial photography at scale with AI
                models that never change face.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white text-[14px] font-medium px-7 py-3 rounded-full hover:bg-black transition-colors"
                >
                  Open Studio <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-600 text-[14px] font-medium px-7 py-3 rounded-full hover:border-zinc-300 transition-colors"
                >
                  See How It Works
                </Link>
              </div>
            </motion.div>

            {/* image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative h-full min-h-[480px]"
            >
              <Image
                src="/assets/landing/hero.png"
                alt="AI Fashion Model in studio"
                fill
                priority
                className="object-cover object-top rounded-bl-[48px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* floating badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg border border-zinc-100">
                <p className="text-[11px] text-zinc-400 mb-1.5">Active Studios</p>
                <div className="flex items-center gap-3">
                  {STUDIOS.map((s) => {
                    const I = s.icon;
                    return (
                      <div
                        key={s.id}
                        className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center"
                      >
                        <I className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ─── BEFORE / AFTER (the key demo section) ─── */}
      <section id="how-it-works" className="py-24 md:py-32 px-6">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="text-[13px] text-zinc-400 font-medium mb-3 tracking-wide">
              See the Transformation
            </p>
            <h2 className="text-[36px] md:text-[44px] font-semibold tracking-tight mb-4 leading-tight">
              Upload a product photo.
              <br />
              <span className="text-zinc-300">Get editorial-ready imagery.</span>
            </h2>
            <p className="text-[16px] text-zinc-500 mb-12 max-w-lg">
              Drag the slider to see how Lumina transforms raw product photos
              into professional, catalog-ready editorial shots.
            </p>
          </FadeIn>

          {/* category tabs */}
          <FadeIn delay={0.1}>
            <div className="flex gap-2 mb-8">
              {BEFORE_AFTER.map((ba, i) => (
                <button
                  key={ba.category}
                  onClick={() => setActiveBA(i)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all ${
                    activeBA === i
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  {ba.category}
                </button>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* slider */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBA}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BeforeAfterSlider
                      before={currentBA.before}
                      after={currentBA.after}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* description */}
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBA}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-[12px] text-zinc-400 font-medium mb-2 uppercase tracking-wider">
                      {currentBA.category}
                    </p>
                    <h3 className="text-[24px] font-semibold mb-4 tracking-tight">
                      {currentBA.label}
                    </h3>
                    <p className="text-[15px] text-zinc-500 leading-relaxed mb-8">
                      {currentBA.desc}
                    </p>
                    <Link
                      href="/studio"
                      className="inline-flex items-center gap-2 bg-zinc-900 text-white text-[14px] font-medium px-6 py-3 rounded-full hover:bg-black transition-colors"
                    >
                      Try it yourself <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── STUDIOS ─── */}
      <section id="studios" className="py-24 md:py-32 px-6 bg-zinc-50">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="text-[13px] text-zinc-400 font-medium mb-3 tracking-wide">
              Multi-Category AI Studios
            </p>
            <h2 className="text-[36px] md:text-[44px] font-semibold tracking-tight mb-16 leading-tight">
              Four specialized engines.
              <br />
              <span className="text-zinc-300">One unified workflow.</span>
            </h2>
          </FadeIn>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* left: studio cards */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {STUDIOS.map((s, i) => (
                <FadeIn key={s.id} delay={i * 0.05}>
                  <StudioCard
                    studio={s}
                    isActive={activeStudio === i}
                    onClick={() => setActiveStudio(i)}
                  />
                </FadeIn>
              ))}
              <FadeIn delay={0.2}>
                <Link
                  href="/studio"
                  className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-zinc-900 hover:gap-3 transition-all"
                >
                  Open Studio <ChevronRight className="w-4 h-4" />
                </Link>
              </FadeIn>
            </div>

            {/* right: showcase */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl p-6 border border-zinc-100 h-full flex flex-col shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex-1 rounded-2xl overflow-hidden bg-zinc-200 mb-6 min-h-[520px] relative aspect-[4/5] lg:aspect-auto">
                      <Image
                        src={current.image}
                        alt={current.label}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <p className="text-white text-[20px] font-semibold">
                          {current.headline}
                        </p>
                      </div>
                    </div>
                    <p className="text-[14px] text-zinc-500 leading-relaxed">
                      {current.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES ─── */}
      <section id="capabilities" className="py-24 md:py-32 px-6">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn>
            <p className="text-[13px] text-zinc-400 font-medium mb-3 tracking-wide">
              Built for Production
            </p>
            <h2 className="text-[36px] md:text-[44px] font-semibold tracking-tight mb-16 leading-tight">
              Not just another AI generator.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <FadeIn key={cap.title} delay={i * 0.05}>
                  <div className="bg-zinc-50 p-7 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-all hover:shadow-sm h-full">
                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center mb-5">
                      <Icon className="w-4 h-4 text-zinc-600" />
                    </div>
                    <h3 className="text-[15px] font-semibold mb-2">{cap.title}</h3>
                    <p className="text-[13px] text-zinc-500 leading-relaxed">
                      {cap.body}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── AI MODELS ─── */}
      <section id="models" className="py-24 md:py-32 px-6 bg-zinc-50">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <p className="text-[13px] text-zinc-400 font-medium mb-3 tracking-wide">
                  Neural DNA Consistency
                </p>
                <h2 className="text-[36px] md:text-[44px] font-semibold tracking-tight mb-6 leading-tight">
                  24 personas. Zero drift.
                </h2>
                <p className="text-[16px] text-zinc-500 leading-relaxed mb-8 max-w-md">
                  Each model is defined by a Neural DNA Blueprint — age, ethnicity,
                  bone structure, body composition. Change the outfit 1,000 times.
                  The face stays the same.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { val: "6", label: "Ethnic backgrounds" },
                    { val: "4", label: "Age groups" },
                    { val: "6", label: "Skin tones" },
                    { val: "100%", label: "Face lock per session" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white rounded-xl p-4 border border-zinc-100"
                    >
                      <p className="text-[24px] font-bold">{s.val}</p>
                      <p className="text-[12px] text-zinc-500">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white text-[14px] font-medium px-7 py-3 rounded-full hover:bg-black transition-colors"
                >
                  Try it now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-3xl overflow-hidden border border-zinc-100 shadow-lg aspect-[4/5] bg-white relative">
                <Image
                  src="/assets/landing/showcase_personas_v2.png"
                  alt="Diverse AI model showcase"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── 3-STEP WORKFLOW ─── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <FadeIn>
            <p className="text-[13px] text-zinc-400 font-medium mb-3 tracking-wide">
              Three steps. That&apos;s it.
            </p>
            <h2 className="text-[36px] md:text-[44px] font-semibold tracking-tight mb-16">
              Upload. Generate. Export.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                step: "01",
                title: "Upload your product",
                body: "Drop a flat-lay, mannequin shot, or garment photo into the studio. Works across all four categories.",
                image: "/assets/landing/step_upload.png",
              },
              {
                step: "02",
                title: "Configure & generate",
                body: "Choose a model, environment, and shot type. Hit generate — or batch all four angles at once.",
                image: "/assets/landing/step_generate.png",
              },
              {
                step: "03",
                title: "Refine & export",
                body: "Use the AI Fix Canvas to correct any detail. Download at high resolution or sync to your marketplace.",
                image: "/assets/landing/step_export.png",
              },
            ].map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div>
                  <div className="rounded-2xl overflow-hidden bg-white aspect-[4/3] mb-6 border border-zinc-100 flex items-center justify-center p-4 relative">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="text-[12px] text-zinc-400 font-medium mb-2">
                    Step {step.step}
                  </p>
                  <h3 className="text-[17px] font-semibold mb-2">{step.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 md:py-32 px-6 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-[1280px] mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[12px] font-semibold uppercase tracking-[.2em] text-zinc-400 mb-4">Pricing</p>
            <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight leading-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-[16px] text-zinc-500 max-w-lg mx-auto">
              Start free. Scale as your catalogue grows. No hidden fees.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* FREE */}
            <FadeIn delay={0} className="bg-white rounded-3xl border border-zinc-200 p-8 flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-zinc-500" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">Try it out</p>
                  <h3 className="text-[16px] font-bold text-zinc-900">Free</h3>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-zinc-900">₹0</span>
                <span className="text-zinc-400 text-sm ml-1">forever</span>
              </div>
              <p className="text-[13px] text-zinc-400 mb-1">10 AI generations total</p>
              <p className="text-[12px] text-zinc-300 mb-6">— per image</p>
              <Link href="/sign-up" className="w-full py-3 rounded-2xl border border-zinc-200 text-zinc-700 text-[13px] font-semibold text-center hover:bg-zinc-50 transition-colors mb-8">
                Get Started Free
              </Link>
              <div className="border-t border-zinc-100 pt-6 space-y-3 flex-1">
                {["10 AI generations", "All studio types", "Standard resolution", "3 AI models", "Community support"].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <span className="text-[13px] text-zinc-500">{f}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* STARTER */}
            <FadeIn delay={0.1} className="bg-white rounded-3xl border-2 border-indigo-600 p-8 flex flex-col relative hover:shadow-xl transition-shadow ring-4 ring-indigo-50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest">
                Most Popular
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">For growing brands</p>
                  <h3 className="text-[16px] font-bold text-zinc-900">Starter</h3>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-zinc-900">₹999</span>
                <span className="text-zinc-500 text-sm ml-1">/ month</span>
              </div>
              <p className="text-[13px] text-zinc-500 mb-1">75 AI generations / month</p>
              <p className="text-[12px] text-zinc-400 mb-6">≈ ₹13.3 per image</p>
              <Link href="/sign-up?plan=STARTER" className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold text-center hover:bg-indigo-700 transition-colors mb-8 shadow-lg shadow-indigo-100">
                Start Selling
              </Link>
              <div className="border-t border-zinc-100 pt-6 space-y-3 flex-1">
                {["75 AI generations / month", "All studio types", "HD resolution output", "15+ AI models", "AI Fix Canvas", "Priority email support", "Generation history"].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-[13px] text-zinc-600">{f}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* PRO */}
            <FadeIn delay={0.2} className="bg-white rounded-3xl border border-zinc-200 p-8 flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">For serious sellers</p>
                  <h3 className="text-[16px] font-bold text-zinc-900">Pro</h3>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-zinc-900">₹2,999</span>
                <span className="text-zinc-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-[13px] text-zinc-400 mb-1">300 AI generations / month</p>
              <p className="text-[12px] text-zinc-300 mb-6">≈ ₹10.0 per image</p>
              <Link href="/sign-up?plan=PRO" className="w-full py-3 rounded-2xl border border-zinc-200 text-zinc-700 text-[13px] font-semibold text-center hover:bg-zinc-50 transition-colors mb-8">
                Go Pro
              </Link>
              <div className="border-t border-zinc-100 pt-6 space-y-3 flex-1">
                {["300 AI generations / month", "All Starter features", "Ultra-HD 4K output", "Batch generation (4 shots)", "Custom model training", "Saree specialist engine", "API access"].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <span className="text-[13px] text-zinc-500">{f}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* ENTERPRISE */}
            <FadeIn delay={0.3} className="bg-white rounded-3xl border border-zinc-200 p-8 flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">Large catalogues</p>
                  <h3 className="text-[16px] font-bold text-zinc-900">Enterprise</h3>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-zinc-900">Custom</span>
              </div>
              <p className="text-[13px] text-zinc-400 mb-1">Unlimited AI generations</p>
              <p className="text-[12px] text-zinc-300 mb-6">Volume pricing available</p>
              <Link href="mailto:hello@luminapro.ai" className="w-full py-3 rounded-2xl border border-zinc-200 text-zinc-700 text-[13px] font-semibold text-center hover:bg-zinc-50 transition-colors mb-8">
                Contact Sales
              </Link>
              <div className="border-t border-zinc-100 pt-6 space-y-3 flex-1">
                {["Unlimited generations", "All Pro features", "White-label solution", "Custom AI model fine-tuning", "Dedicated GPU cluster", "99.9% SLA guarantee", "Dedicated account manager"].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <span className="text-[13px] text-zinc-500">{f}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn className="mt-10 text-center">
            <p className="text-[13px] text-zinc-400">
              All plans include SSL encryption, GDPR compliance &amp; 99.9% uptime. No credit card required for Free plan.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-[640px] mx-auto text-center">
          <FadeIn>
            <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight leading-tight text-zinc-900 mb-6">
              Ready to automate your
              <br />
              product photography?
            </h2>
            <p className="text-[16px] text-zinc-500 mb-10">
              Join brands that have cut shoot costs by 90% and reduced turnaround
              from weeks to hours.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 bg-black text-white text-[14px] font-medium px-8 py-3 rounded-full hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-600 text-[14px] font-medium px-8 py-3 rounded-full hover:bg-zinc-50 transition-colors"
              >
                Book a Demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 px-6 border-t border-zinc-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-[14px] font-bold tracking-tight">Lumina</span>
              </div>
              <p className="text-[13px] text-zinc-500 leading-relaxed max-w-xs">
                AI product photography for every category. Built for teams that
                ship fast.
              </p>
            </div>
            {[
              {
                title: "Studios",
                links: ["Apparel", "Jewellery", "Home & Decor", "Pet Fashion"],
              },
              {
                title: "Platform",
                links: ["Neural DNA", "AI Fix Canvas", "Batch Mode", "API"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Pricing", "Contact"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[13px] font-semibold mb-4">{col.title}</h4>
                <div className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <Link
                      key={l}
                      href="/studio"
                      className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-zinc-400">
              © 2026 Lumina Studios. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[12px] text-zinc-400">
              <span className="hover:text-zinc-600 cursor-pointer">Terms</span>
              <span className="hover:text-zinc-600 cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
