"use client";

import React, { useRef, DragEvent, ChangeEvent, useState, useEffect, useMemo } from "react";
import Link from 'next/link';
import NextImage from 'next/image';
import { 
  Wand2, 
  UploadCloud, 
  Download,
  Shirt,
  Sparkles,
  X,
  UserCircle2,
  Baby,
  PersonStanding,
  CheckCircle2,
  RefreshCcw,
  Loader2,
  Footprints,
  Maximize2,
  Image as ImageIcon,
  RotateCcw,
  Focus,
  Palmtree,
  Building2,
  Home,
  MonitorPlay,
  LayoutGrid,
  Gem,
  Lamp,
  Sofa,
  Watch,
  Dog,
  Cat,
  Fingerprint,
  AlertCircle,
  ChevronLeft,
  LayoutPanelLeft,
  Camera,
  Layers,
  Eraser,
  Paintbrush,
  Check,
  MousePointer2,
  Settings,
  HelpCircle,
  Lightbulb,
  Brush,
  User,
  AlertTriangle,
  Upload
} from "lucide-react";
import { useStudioStore, ApparelMode, Gender, Ethnicity, SkinTone, StudioType, ShotType, Environment, MODEL_LIBRARY } from "@/lib/store";

// Helper for image optimization
const downscaleImage = (base64: string, maxDim: number = 1024): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height) {
        if (width > maxDim) { height *= maxDim / width; width = maxDim; }
      } else {
        if (height > maxDim) { width *= maxDim / height; height = maxDim; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
  });
};

const DropzoneSlot = ({ 
  slotId, label, icon: Icon, image, onImageSet, onRemove, className = "", onMouseEnter, onMouseLeave
}: { 
  slotId: string, label: string, icon: any, image: string | null, onImageSet: (file: string) => void, onRemove: () => void, className?: string, onMouseEnter?: () => void, onMouseLeave?: () => void
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onImageSet(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`w-full h-full min-h-[100px] rounded-2xl border-2 border-dashed transition-all duration-300 relative cursor-pointer flex flex-col items-center justify-center gap-3 ${className}
        ${isDragging ? "border-indigo-400 bg-indigo-50" : "border-zinc-200 bg-zinc-50/50 hover:border-indigo-500/30 hover:bg-zinc-100"}`}
    >
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      {image ? (
        <div className="w-full h-full relative rounded-2xl overflow-hidden group">
          <img src={image} className="w-full h-full object-contain relative z-10" alt={label} />
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 z-20 px-2 py-1 bg-black/80 rounded backdrop-blur-sm border border-white/5 text-[9px] font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
            <Icon className="w-3 h-3 text-indigo-400" /> {label}
          </div>
        </div>
      ) : (
        <>
          <div className="p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <Icon className={`w-6 h-6 ${isDragging ? "text-indigo-600" : "text-zinc-400"}`} />
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[.2em]">Upload {label}</p>
        </>
      )}
    </div>
  );
};

const SareeGuideTooltip = () => (
  <div className="w-[280px] p-6 rounded-[32px] bg-white border border-zinc-200 shadow-[0_30px_60px_rgba(0,0,0,0.1)] backdrop-blur-3xl animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-500">
    <div className="space-y-6">
      <header className="flex items-center gap-3 border-b border-zinc-100 pb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-[.3em]">Master-Drape Guide</span>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
            <div className="aspect-[3/2] rounded-xl bg-zinc-100 border-2 border-emerald-500/30 relative overflow-hidden group/guide">
                <img src="/assets/guides/saree_guide_good.png" className="w-full h-full object-cover" alt="Correct Broad Shot" />
                <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5 shadow-lg"><Check className="w-2.5 h-2.5 text-white" /></div>
            </div>
            <p className="text-[8px] font-black text-emerald-600 uppercase text-center tracking-tighter italic">✔ DO: Broad Shot</p>
        </div>
        <div className="space-y-3">
            <div className="aspect-[3/2] rounded-xl bg-black border-2 border-red-500/10 relative overflow-hidden opacity-60 grayscale group/guide">
                <img src="/assets/guides/saree_guide_bad.png" className="w-full h-full object-cover" alt="Incorrect Folded Shot" />
                <div className="absolute top-2 right-2 bg-red-500 rounded-full p-0.5 shadow-lg"><X className="w-2.5 h-2.5 text-black" /></div>
            </div>
            <p className="text-[8px] font-black text-red-500/60 uppercase text-center tracking-tighter italic">✖ NOT: Folded Shot</p>
        </div>
      </div>

      <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-3">
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
            AI captures the <span className="text-zinc-900">Pallu pattern</span> from the wide spread fabric. 
        </p>
        <p className="text-[8px] text-zinc-400 italic font-medium uppercase tracking-tighter">
            Spread your saree flat on a floor or table before shooting.
        </p>
      </div>
    </div>
  </div>
);
const CanvasEditor = ({ 
    image, assets, shotType, onCancel, onApply, isProcessing 
}: { 
    image: string, assets: any[], shotType: ShotType, onCancel: () => void, onApply: (mask: string, prompt: string) => void, isProcessing: boolean 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [fixPrompt, setFixPrompt] = useState("");
    const [brushSize, setBrushSize] = useState(40);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "white";
    };

    useEffect(() => { 
        setupCanvas(); 
        fetchSuggestions();
    }, [image]);

    const fetchSuggestions = async () => {
        setIsSuggesting(true);
        try {
            const pAssets = await Promise.all(assets.map(async (a: string) => await downscaleImage(a)));
            const resp = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    mode: 'suggest', 
                    shotType,
                    originalImage: await downscaleImage(image),
                    assets: pAssets
                })
            });
            const data = await resp.json();
            if (data.success) setSuggestions(data.suggestions);
        } catch (e) { console.error("Suggestions failed", e); }
        finally { setIsSuggesting(false); }
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        handleMove(e);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);

        ctx.lineWidth = brushSize;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleEnd = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) canvas.getContext('2d')?.beginPath();
    };

    return (
        <div className="absolute inset-0 bg-white/95 z-[60] flex flex-col items-center justify-center p-10 animate-in fade-in duration-500 font-sans">
            <div className="relative group shadow-2xl rounded-[40px] overflow-hidden bg-white border border-zinc-200" style={{ aspectRatio: '3/4', maxHeight: '70vh' }}>
                <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" alt="Base" />
                <canvas 
                    ref={canvasRef} width={600} height={800}
                    onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd}
                    onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
                    className={`relative z-10 w-full h-full cursor-crosshair opacity-80 mix-blend-screen transition-opacity ${isProcessing ? 'pointer-events-none opacity-20' : ''}`}
                />

                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-xl border border-zinc-200 backdrop-blur-md shadow-lg">
                    <Camera className="w-3 h-3 text-indigo-600" />
                    <span className="text-[9px] font-black text-zinc-900 uppercase tracking-[.2em]">Editing: {shotType}</span>
                </div>
                
                {isProcessing && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-full border-2 border-indigo-100 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            </div>
                            <div className="absolute inset-0 w-24 h-24 rounded-full border-t-2 border-indigo-600 animate-spin duration-700"></div>
                        </div>
                        <p className="text-[10px] font-black tracking-[.6em] text-zinc-900 uppercase animate-pulse">Syncing Synthesis...</p>
                        <p className="text-[8px] font-bold text-zinc-400 uppercase mt-4 tracking-widest">Applying Pixel-Perfect Retouch</p>
                    </div>
                )}
            </div>

            <div className={`mt-8 w-full max-w-3xl bg-white border border-zinc-200 rounded-[32px] p-8 flex flex-col gap-6 shadow-3xl transition-all duration-500 ${isProcessing ? 'opacity-50 pointer-events-none scale-95 grayscale' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-zinc-200 p-0.5 bg-white shadow-sm ring-2 ring-zinc-50">
                            <UserButton signOutUrl="/" />
                        </div>
                        <div className="flex bg-zinc-100 rounded-xl p-1 border border-zinc-200">
                            <div className="flex items-center gap-1 bg-white rounded-lg px-3 py-2 border border-indigo-400/20 shadow-sm">
                                <Paintbrush className="w-4 h-4 text-indigo-600" />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Paint</span>
                            </div>
                            <button onClick={setupCanvas} className="flex items-center gap-1 px-3 py-2 rounded-lg text-zinc-500 hover:text-zinc-900 transition-all group" title="Clear Mask">
                                <Eraser className="w-4 h-4 group-hover:scale-110" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Clear</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Size</span>
                            <input 
                              type="range" min="10" max="150" value={brushSize} 
                              onChange={(e) => setBrushSize(parseInt(e.target.value))} 
                              className="w-32 accent-indigo-600 h-1 rounded-full bg-zinc-100 appearance-none cursor-pointer" 
                            />
                        </div>
                    </div>
                    <button onClick={onCancel} className="text-zinc-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">Cancel Retouch</button>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="w-3 h-3 text-yellow-500" />
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Strong AI Perception: Comparative Audit Active</span>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[32px] max-h-[100px] overflow-y-auto no-scrollbar">
                        {isSuggesting ? (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin text-zinc-300" />
                                <span className="text-[8px] text-zinc-400 font-bold uppercase">Comparing Result vs Reference Assets...</span>
                            </div>
                        ) : suggestions.map((s, idx) => (
                            <button 
                                key={idx} onClick={() => setFixPrompt(s)}
                                className="px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-[9px] font-bold text-zinc-500 hover:text-indigo-600 uppercase tracking-tighter"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <input 
                        value={fixPrompt} onChange={(e) => setFixPrompt(e.target.value)}
                        placeholder="Describe the fix (e.g. 'Align the plaid pattern perfectly')"
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500/30 transition-all font-medium placeholder:text-zinc-400 shadow-inner"
                    />
                    <button 
                        onClick={() => onApply(canvasRef.current?.toDataURL() || "", fixPrompt)}
                        className={`px-8 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 transition-all ${fixPrompt ? "bg-zinc-900 text-white hover:bg-black shadow-xl shadow-zinc-200" : "bg-zinc-100 text-zinc-400 cursor-not-allowed"}`}
                        disabled={!fixPrompt || isProcessing}
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Execute Synthesis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isFixMode, setIsFixMode] = useState(false);
  const [isFootwearMenuOpen, setIsFootwearMenuOpen] = useState(false);
  const footwearInputRef = useRef<HTMLInputElement>(null);

  // Credits system
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [userPlan, setUserPlan] = useState<string>("FREE");
  const [totalCredits, setTotalCredits] = useState<number>(10);

  useEffect(() => {
    fetch("/api/credits")
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setUserCredits(data.credits);
          setUserPlan(data.plan);
          setTotalCredits(data.totalCredits);
        }
      })
      .catch(() => {});
  }, []);


  const [isSareeValid, setIsSareeValid] = useState(true);
  const [isSareeGuideOpen, setIsSareeGuideOpen] = useState(false);
  const [isSareeManuallyConfirmed, setIsSareeManuallyConfirmed] = useState(false);

  const { 
    activeStudio, apparelMode, garments, jewellery, homeAssets, petAssets, modelConfig, 
    selectedModelId, setSelectedModelId, // <--- Add these
    environment, finalImage,
    shotGallery, currentShot, customPrompt,
    setActiveStudio, setApparelMode, setGarment, setJewellery, setHomeAsset, setPetAsset, setModelConfig, setEnvironment,
    setFinalImage, setShot, setCurrentShot, setCustomPrompt, resetAll
  } = useStudioStore();

  // --- Saree Validation Logic (Portrait-Aware Heuristic) ---
  useEffect(() => {
    const sareeAsset = garments.dress;
    if (apparelMode === 'saree' && sareeAsset) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        // HEURISTIC: Vertical shot detected. If height is high (>1000px), it's likely a full spread.
        // Also resets manual confirmation on new image upload
        if ((aspectRatio < 0.7 && img.height < 1000) || img.height < 600) {
          setIsSareeValid(false);
        } else {
          setIsSareeValid(true);
        }
        setIsSareeManuallyConfirmed(false);
      };
      img.src = sareeAsset;
    } else {
      setIsSareeValid(true);
      setIsSareeManuallyConfirmed(false);
    }
  }, [garments.dress, apparelMode]);
  
  const currentAssets = useMemo(() => {
    let list: string[] = [];
    if (activeStudio === 'Apparel') {
       if (garments.top) list.push(garments.top);
       if (garments.bottom) list.push(garments.bottom);
       if (garments.dress) list.push(garments.dress);
       if (garments.shoes) list.push(garments.shoes);
    } else if (activeStudio === 'Jewellery') {
       if (jewellery.necklace) list.push(jewellery.necklace);
       if (jewellery.ring) list.push(jewellery.ring);
       if (jewellery.watch) list.push(jewellery.watch);
    } else if (activeStudio === 'Home') {
       if (homeAssets.furniture) list.push(homeAssets.furniture);
       if (homeAssets.lighting) list.push(homeAssets.lighting);
    } else if (activeStudio === 'Pets') {
       if (petAssets.breed) list.push(petAssets.breed);
       if (petAssets.outfit) list.push(petAssets.outfit);
    }
    return list;
  }, [activeStudio, garments, jewellery, homeAssets, petAssets]);

  const ageConstraints = useMemo(() => {
    switch (modelConfig.gender) {
      case 'Infant': return { min: 0, max: 2, label: 'Months / Years' };
      case 'Kid': return { min: 3, max: 12, label: 'Childhood' };
      default: return { min: 18, max: 80, label: 'Adult years' };
    }
  }, [modelConfig.gender]);

  useEffect(() => {
    if (modelConfig.age < ageConstraints.min) setModelConfig('age', ageConstraints.min);
    if (modelConfig.age > ageConstraints.max) setModelConfig('age', ageConstraints.max);
  }, [modelConfig.gender]);

  // -- SAFETY REDIRECT: Ensure users don't land on 'Coming Soon' studios --
  useEffect(() => {
    const restricted = ['Jewellery', 'Home', 'Pets'];
    if (restricted.includes(activeStudio)) {
      setActiveStudio('Apparel');
    }
  }, [activeStudio]);

  const studios: { id: StudioType, icon: any, label: string, comingSoon?: boolean }[] = [
    { id: 'Apparel', icon: Shirt, label: 'Apparel' },
    { id: 'Jewellery', icon: Gem, label: 'Jewellery', comingSoon: true },
    { id: 'Home', icon: Home, label: 'Home', comingSoon: true },
    { id: 'Pets', icon: Dog, label: 'Pets', comingSoon: true }
  ];

  const skinTones: { id: SkinTone, color: string }[] = [
    { id: 'Porcelain', color: '#ffefdb' }, { id: 'Fair', color: '#f8d9b5' },
    { id: 'Olive', color: '#ae8b61' }, { id: 'Tan', color: '#8d5524' },
    { id: 'Brown', color: '#68361b' }, { id: 'Rich Dark', color: '#3d1c02' }
  ];

  const canGenerate = useMemo(() => {
    if (activeStudio === 'Apparel') {
        if (apparelMode === 'separates') return !!garments.top && !!garments.bottom;
        if (apparelMode === 'dress' || apparelMode === 'saree') return !!garments.dress;
        if (apparelMode === 'laydown') return !!garments.top || !!garments.dress;
        return false;
    }
    if (activeStudio === 'Jewellery') return !!jewellery.necklace || !!jewellery.watch || !!jewellery.ring;
    if (activeStudio === 'Home') return !!homeAssets.furniture || !!homeAssets.lighting;
    if (activeStudio === 'Pets') return !!petAssets.breed;
    return false;
  }, [activeStudio, apparelMode, garments, jewellery, homeAssets, petAssets]);

  const environments: { id: Environment, icon: any, label: string }[] = [
    { id: 'Studio', icon: ImageIcon, label: 'Studio' },
    { id: 'Urban', icon: Building2, label: 'Urban' },
    { id: 'Nature', icon: Palmtree, label: 'Nature' },
    { id: 'Luxury', icon: Home, label: 'Luxury' }
  ];

  const defaultShoes = [
    { id: 'sneakers', name: 'Sneakers', url: '/assets/shoes/sneakers.png' },
    { id: 'heels', name: 'Heels', url: '/assets/shoes/heels.png' },
    { id: 'boots', name: 'Boots', url: '/assets/shoes/boots.png' },
    { id: 'loafers', name: 'Loafers', url: '/assets/shoes/loafers.png' },
    { id: 'ethnic', name: 'Sandals', url: '/assets/shoes/ethnic_sandal.png' }
  ];

  const handleDefaultShoe = async (url: string) => {
    try {
      const resp = await fetch(url);
      const b = await resp.blob();
      const r = new FileReader();
      r.onload = (e) => setGarment('shoes', e.target?.result as string);
      r.readAsDataURL(b);
      setIsFootwearMenuOpen(false);
    } catch (err) { console.error("Failed to load default shoe:", err); }
  };

  const handleCustomFootwear = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        setGarment('shoes', ev.target?.result as string);
        setIsFootwearMenuOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const uploadToStorage = async (base64Str: string) => {
    if (base64Str.startsWith("http")) return base64Str; // already uploaded
    const res = await fetch(base64Str);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "upload.jpg");
    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await uploadRes.json();
    return data.url;
  };

  const handleGenerateShot = async (type: ShotType, refImg?: string | null) => {
    if (!canGenerate) return null;
    setIsGenerating(type);
    setCurrentShot(type);
    setGenerationError(null);
    
    try {
      // 1. Prepare Base64 -> Supabase URLs for AI Models
      let primaryImageUrl = "";
      if (activeStudio === 'Apparel') {
         if (apparelMode === 'dress' || apparelMode === 'saree') primaryImageUrl = await uploadToStorage(await downscaleImage(garments.dress!));
         else if (apparelMode === 'laydown') primaryImageUrl = await uploadToStorage(await downscaleImage(garments.top || garments.dress!));
         else if (garments.top && garments.bottom) primaryImageUrl = await uploadToStorage(await downscaleImage(garments.top)); // Fallback
      } else if (activeStudio === 'Jewellery' && jewellery.necklace) {
         primaryImageUrl = await uploadToStorage(await downscaleImage(jewellery.necklace));
      }

      // 2. Queue Job
      const payload = {
        imageUrl: primaryImageUrl,
        category: activeStudio,
        prompt: customPrompt,
        shotType: type
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!data.success) {
        setGenerationError(data.error || "A synthesis error occurred. Please try again.");
        setIsGenerating(null);
        return null;
      }

      // 3. Poll for Background Completion
      const generationId = data.generationId;
      let isComplete = false;
      let finalUrl = null;
      let attempts = 0;

      while (!isComplete && attempts < 40) { // 80s Max Timeout
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusRes = await fetch(`/api/generate/status?id=${generationId}`);
        if (!statusRes.ok) continue;
        const statusData = await statusRes.json();

        if (statusData.status === 'completed') {
           isComplete = true;
           finalUrl = statusData.outputUrl;
        } else if (statusData.status === 'failed' || statusData.error) {
           isComplete = true;
           setGenerationError("The AI engine failed to process this image.");
        }
        attempts++;
      }

      if (!finalUrl) {
         setGenerationError("Processing timed out. The cluster is heavily loaded.");
         setIsGenerating(null);
         return null;
      }

      if (type === 'main') setFinalImage(finalUrl);
      else setShot(type, finalUrl);
      setTimeout(() => setIsGenerating(null), 100);
      return finalUrl;
    } catch (error: any) {
      setGenerationError("Connection failure / Session timeout.");
      setIsGenerating(null);
      return null;
    }
  };

  const handleApplyFix = async (mask: string, prompt: string) => {
    const originalHost = shotGallery[currentShot];
    if (!originalHost) return;
    setIsGenerating('fix');
    setGenerationError(null);

    try {
        const payload = { 
            mode: 'fix', 
            shotType: currentShot,
            originalImage: await downscaleImage(originalHost),
            maskImage: await downscaleImage(mask),
            fixPrompt: prompt
        };
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
            setShot(currentShot, data.generatedImage);
            if (currentShot === 'main') setFinalImage(data.generatedImage);
            setIsFixMode(false);
        } else {
            setGenerationError(data.error || "Fix engine failure.");
        }
    } catch (err) {
        setGenerationError("Connection failure during retouch.");
    } finally {
        setIsGenerating(null);
    }
  };

  const gENERATE_aLL = async () => {
    if (!canGenerate || isBatchRunning) return;
    setIsBatchRunning(true); setBatchProgress(0); setGenerationError(null);
    const mainImg = await handleGenerateShot('main');
    if (!mainImg) { setIsBatchRunning(false); return; }
    setBatchProgress(25);
    await handleGenerateShot('side', mainImg); setBatchProgress(50);
    await handleGenerateShot('pose', mainImg); setBatchProgress(75);
    await handleGenerateShot('closeup', mainImg); setBatchProgress(100);
    setTimeout(() => { setIsBatchRunning(false); setCurrentShot('main'); }, 200);
  };

  const handleDownload = async () => {
    const img = shotGallery[currentShot];
    if (!img) return;
    const link = document.createElement("a");
    link.href = img;
    link.download = `lumina_pro_${currentShot}.png`;
    link.click();
  };

  const handleCloseResult = () => {
    setFinalImage(null);
    setCurrentShot('main');
  };

  const genders: Gender[] = ['Female', 'Male', 'Kid', 'Infant'];

  const shots: { id: ShotType, label: string, icon: any }[] = [
    { id: 'main', label: 'Primary Capture', icon: Camera },
    { id: 'side', label: 'Side Profile', icon: RotateCcw },
    { id: 'pose', label: 'Hero Action', icon: Maximize2 },
    { id: 'closeup', label: 'Macro Focus', icon: Focus }
  ];

  const SectionHeader = ({ title, note }: { title: string, note: string }) => (
    <div className="space-y-1 mb-4">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[.4em] leading-none">{title}</h3>
        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">{note}</p>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans text-zinc-600">
      
      {isFixMode && shotGallery[currentShot] && (
        <CanvasEditor 
            image={shotGallery[currentShot]!} 
            assets={currentAssets}
            shotType={currentShot}
            onCancel={() => setIsFixMode(false)}
            onApply={handleApplyFix}
            isProcessing={isGenerating === 'fix'}
        />
      )}

      <aside className="w-80 border-r border-zinc-200 bg-white/80 backdrop-blur-3xl flex flex-col pt-10 pb-6 px-10 z-30 shadow-xl overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-4 w-full mb-12">
            <div className="h-14 w-14 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-indigo-400/20 group hover:scale-105 transition-all">
                <Sparkles className="text-white w-7 h-7" />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter text-zinc-900 leading-none">Lumina<span className="text-indigo-600 italic">Pro</span></h1>
                <p className="text-[9px] uppercase tracking-[.4em] text-zinc-400 font-bold mt-2">v2.1 AI Hub</p>
            </div>
        </div>

        <div className="flex-1 space-y-12 w-full pb-10">
          
          <div className="space-y-4">
             <SectionHeader title="Atmosphere" note="Lighting and environment profile" />
             <div className="grid grid-cols-2 gap-3">
                {environments.map(env => (
                    <button
                        key={env.id} onClick={() => setEnvironment(env.id)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-[24px] border transition-all ${
                            environment === env.id 
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' 
                                : 'bg-white border-zinc-100 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300'
                        }`}
                    >
                        <env.icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase italic">{env.id}</span>
                    </button>
                ))}
             </div>
          </div>

          <div className={`space-y-4 pt-8 border-t border-white/5 transition-all duration-700 ${apparelMode === 'laydown' ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
            <SectionHeader title="Model Persona" note="Target identity for human photography" />
            <div className="grid grid-cols-2 gap-2">
            {genders.map((g) => (
                <button
                key={g} onClick={() => setModelConfig('gender', g)}
                className={`px-3 py-3 text-[11px] font-black rounded-2xl border transition-all uppercase tracking-tighter ${
                    modelConfig.gender === g 
                    ? 'bg-zinc-900 text-white border-zinc-800' 
                    : 'bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50'
                }`}
                >
                {g}
                </button>
            ))}
            </div>

            <div className="space-y-4 pt-4">
                <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Skin Tone Selection</label>
                <div className="flex items-center justify-between px-1">
                    {skinTones.map((tone) => (
                        <button
                            key={tone.id} onClick={() => setModelConfig('skinTone', tone.id)}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${
                                modelConfig.skinTone === tone.id ? 'border-indigo-500 scale-125 shadow-lg' : 'border-zinc-200 hover:scale-110'
                            }`}
                            style={{ backgroundColor: tone.color }}
                            title={tone.id}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-none">Age: <span className="text-zinc-900 ml-2 text-sm">{modelConfig.age}</span></label>
                    <span className="text-[9px] text-zinc-400 font-black italic uppercase tracking-tighter">{ageConstraints.label}</span>
                </div>
                <input 
                    type="range" min={ageConstraints.min} max={ageConstraints.max} value={modelConfig.age}
                    onChange={(e) => setModelConfig('age', parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1 rounded-full bg-zinc-200 appearance-none cursor-pointer"
                />
            </div>
          </div>

          <div className="space-y-4 border-t border-white/5 pt-8">
            <SectionHeader title="Studio Instruction" note="Custom assistant direction" />
            <textarea 
              value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Drape the saree with elegant pleats, soft lighting..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-3xl text-[11px] text-zinc-900 p-5 min-h-[100px] focus:outline-none focus:border-indigo-500/30 placeholder:text-zinc-400 resize-none transition-all shadow-inner"
            />
          </div>
        </div>

      </aside>


      <main className="flex-1 bg-zinc-50 relative flex flex-col overflow-hidden">
        
        <header className="h-24 border-b border-zinc-200 flex items-center justify-between px-12 relative z-40 backdrop-blur-3xl bg-white/50">
           <div className="flex items-center gap-2 p-1.5 rounded-[24px] bg-zinc-100 border border-zinc-200 shadow-inner">
                {studios.map(studio => (
                  <button
                    key={studio.id} 
                    onClick={() => { 
                      if (studio.comingSoon) return;
                      setActiveStudio(studio.id); 
                      setFinalImage(null); 
                    }}
                    disabled={studio.comingSoon}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 relative group/sbtn ${
                        studio.comingSoon
                            ? 'text-zinc-300 cursor-not-allowed grayscale opacity-50'
                            : activeStudio === studio.id 
                                ? 'bg-white text-zinc-900 shadow-xl scale-[1.02] border border-zinc-100' 
                                : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <studio.icon className={`w-4 h-4 ${activeStudio === studio.id ? 'text-indigo-600' : ''}`} />
                    <span className="text-[11px] font-black uppercase tracking-[.2em]">{studio.label}</span>
                    {studio.comingSoon && (
                      <span className="absolute -top-1 -right-2 px-1.5 py-0.5 rounded-full bg-indigo-500 text-[6px] font-black text-white uppercase tracking-tighter opacity-0 group-hover/sbtn:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Coming Soon
                      </span>
                    )}
                  </button>
                ))}
           </div>

           <div className="flex items-center gap-5">
              <a href="/pricing" className="flex items-center gap-4 px-5 py-2 rounded-2xl bg-white border border-zinc-200 hover:border-indigo-300 transition-all group shadow-sm">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-900 tracking-widest uppercase">
                      {userCredits ?? 0} / {totalCredits}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter ${
                      userPlan === "PRO" ? "bg-amber-100 text-amber-600" :
                      userPlan === "STARTER" ? "bg-indigo-100 text-indigo-600" :
                      "bg-zinc-100 text-zinc-500"
                    }`}>
                      {userPlan}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-100 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        userCredits !== null && userCredits <= 2 ? "bg-red-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${userCredits !== null ? (userCredits / totalCredits) * 100 : 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white transition-all" />
                </div>
              </a>

              <div className="w-[1px] h-8 bg-white/5 hidden md:block" />

              <div className="flex items-center gap-5">
               {finalImage && (
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsFixMode(true)} className="px-6 py-3 rounded-2xl bg-white text-indigo-600 text-[11px] font-black transition-all flex items-center gap-3 hover:bg-indigo-50 border border-indigo-200 shadow-sm">
                      <Paintbrush className="w-5 h-5" /> AI Fix Canvas
                    </button>
                    <button onClick={handleDownload} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-[11px] font-black transition-all flex items-center gap-3 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                      <Download className="w-5 h-5" /> Download Result
                    </button>
                    <button onClick={handleCloseResult} className="px-6 py-3 rounded-2xl bg-black text-white text-[11px] font-black transition-all flex items-center gap-3 hover:bg-zinc-800">
                      <ChevronLeft className="w-5 h-5" /> Back to Studio
                    </button>
                </div>
               )}
                <button onClick={() => { resetAll(); setGenerationError(null); }} className="p-4 rounded-2xl bg-white border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
         </header>

        <div className="flex-1 p-12 flex gap-12 items-start justify-center relative z-10 overflow-hidden">
          
          <div className="w-[340px] h-full shrink-0 flex flex-col gap-8 transition-all duration-1000 overflow-y-auto no-scrollbar pb-20">
             
             {activeStudio === 'Apparel' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                   
                   <div className="space-y-4">
                     <SectionHeader title="Model Library" note={`Consistent ${modelConfig.gender} Personas`} />
                     <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar-on-touch" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
                        {MODEL_LIBRARY.filter(m => m.gender === modelConfig.gender).map((model) => (
                            <button 
                                key={model.id} onClick={() => setSelectedModelId(model.id)}
                                className={`flex-shrink-0 w-28 group transition-all ${selectedModelId === model.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <div className={`aspect-[3/4] rounded-[28px] overflow-hidden mb-3 border-2 transition-all ${selectedModelId === model.id ? 'border-indigo-600 shadow-2xl shadow-indigo-100' : 'border-zinc-100 hover:border-zinc-200'}`}>
                                    <div className="w-full h-full bg-zinc-50 flex items-center justify-center relative">
                                        {model.thumbnail.includes('.png') ? (
                                            <NextImage 
                                              src={model.thumbnail} 
                                              fill
                                              className="object-cover" 
                                              alt={model.name} 
                                              sizes="112px"
                                            />
                                        ) : (
                                            <User className={`w-10 h-10 ${selectedModelId === model.id ? 'text-indigo-600' : 'text-zinc-200'}`} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                                            <div className="text-left w-full">
                                                <span className="block text-[10px] font-black text-white uppercase tracking-widest truncate">{model.name}</span>
                                                <span className="block text-[7px] text-zinc-500 font-bold uppercase tracking-tighter mt-1">{model.ethnicity}</span>
                                            </div>
                                        </div>
                                        {selectedModelId === model.id && (
                                            <div className="absolute top-3 right-3 z-20 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                        {MODEL_LIBRARY.filter(m => m.gender === modelConfig.gender).length === 0 && (
                            <div className="w-full py-8 text-center bg-zinc-50 rounded-2xl border border-zinc-100">
                                <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">No profiles for {modelConfig.gender}</p>
                            </div>
                        )}
                     </div>
                   </div>

                   <div className="space-y-4">
                     <SectionHeader title="Hub Config" note="Product asset deployment" />
                     <div className="grid grid-cols-2 gap-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 shadow-inner">
                        {['separates', 'dress', 'saree', 'laydown'].map((m) => (
                            <button 
                                key={m} onClick={() => setApparelMode(m as ApparelMode)} 
                                className={`px-2 py-2 text-[8px] font-black uppercase rounded-xl transition-all ${apparelMode === m ? 'bg-white text-zinc-900 shadow-lg border border-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                                {m}
                            </button>
                        ))}
                     </div>
                   </div>
                   <div className="space-y-6 pb-6">
                        {apparelMode === 'separates' && (
                        <>
                            <div className="h-[180px]"><DropzoneSlot slotId="top" label="Top / Cover" icon={Shirt} image={garments.top} onImageSet={(v) => setGarment('top', v)} onRemove={() => setGarment('top', null)} /></div>
                            <div className="h-[180px]"><DropzoneSlot slotId="bottom" label="Bottoms" icon={PersonStanding} image={garments.bottom} onImageSet={(v) => setGarment('bottom', v)} onRemove={() => setGarment('bottom', null)} /></div>
                        </>
                        )}
                        {(apparelMode === 'dress' || apparelMode === 'saree') && (
                            <div className="h-[372px] relative group/saree">
                                <DropzoneSlot 
                                    slotId="dress" 
                                    label={apparelMode === 'saree' ? "Broad Saree Asset" : "One-Piece"} 
                                    icon={apparelMode === 'saree' ? Sparkles : Shirt} 
                                    image={garments.dress} 
                                    onImageSet={(v) => setGarment('dress', v)} 
                                    onRemove={() => setGarment('dress', null)} 
                                />
                                {apparelMode === 'saree' && (
                                    <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-indigo-600 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-xl animate-bounce">Saree Master-Drape Active</div>
                                )}
                                
                                {apparelMode === 'saree' && !isSareeValid && !isSareeManuallyConfirmed && garments.dress && (
                                    <div className="absolute inset-0 z-30 pointer-events-none p-6 flex items-end">
                                        <div 
                                            className="w-full p-4 rounded-2xl bg-amber-500/90 backdrop-blur-md border border-amber-400 shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500 pointer-events-auto relative overflow-hidden"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <div 
                                                    className="flex items-center gap-3 cursor-help flex-1"
                                                    onMouseEnter={() => setIsSareeGuideOpen(true)}
                                                    onMouseLeave={() => setIsSareeGuideOpen(false)}
                                                >
                                                    <AlertTriangle className="w-5 h-5 text-black" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-black uppercase tracking-widest">Detail Alert</p>
                                                        <p className="text-[8px] text-black/80 font-bold uppercase tracking-tighter leading-tight mt-0.5">Vertical shot detected. Spread confirmed?</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setIsSareeManuallyConfirmed(true)}
                                                    className="px-4 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl flex items-center gap-2"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Confirm Detail
                                                </button>
                                            </div>

                                            {isSareeGuideOpen && (
                                                <div className="absolute bottom-full left-0 mb-4 z-50">
                                                    <SareeGuideTooltip />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {apparelMode === 'laydown' && (
                            <div className="space-y-5">
                                <div className="h-[180px]"><DropzoneSlot slotId="top" label="Flat Top" icon={Shirt} image={garments.top} onImageSet={(v) => setGarment('top', v)} onRemove={() => setGarment('top', null)} /></div>
                                <div className="h-[180px]"><DropzoneSlot slotId="dress" label="Flat Full" icon={LayoutGrid} image={garments.dress} onImageSet={(v) => setGarment('dress', v)} onRemove={() => setGarment('dress', null)} /></div>
                            </div>
                        )}
                        <div className="space-y-4 pt-2 relative">
                             <div className="h-[120px] relative transition-all group">
                                <DropzoneSlot 
                                    slotId="shoes" label="Footwear" icon={Footprints} image={garments.shoes} 
                                    onImageSet={(v) => setGarment('shoes', v)} onRemove={() => setGarment('shoes', null)} 
                                    onMouseEnter={() => setIsFootwearMenuOpen(true)}
                                />
                                {isFootwearMenuOpen && (
                                    <div className="absolute top-0 left-full ml-4 z-50 w-72 bg-white border border-zinc-200 rounded-[32px] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.1)] animate-in slide-in-from-left-4 fade-in duration-300" onMouseLeave={() => setIsFootwearMenuOpen(false)}>
                                        <div className="space-y-4">
                                            <header className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                                                <MousePointer2 className="w-3 h-3 text-indigo-600" />
                                                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Library Select</span>
                                            </header>
                                            <div className="grid grid-cols-3 gap-3">
                                                <input type="file" ref={footwearInputRef} className="hidden" accept="image/*" onChange={handleCustomFootwear} />
                                                {defaultShoes.map(shoe => (
                                                    <button 
                                                        key={shoe.id} onClick={() => handleDefaultShoe(shoe.url)} 
                                                        className="aspect-square rounded-2xl border border-zinc-100 bg-zinc-50 overflow-hidden p-1.5 hover:border-indigo-300 transition-all group/shoe relative"
                                                        title={shoe.name}
                                                    >
                                                        <NextImage 
                                                          src={shoe.url} 
                                                          alt={shoe.name} 
                                                          fill
                                                          className="object-contain p-1.5 group-hover/shoe:scale-110 transition-transform" 
                                                          sizes="100px"
                                                        />
                                                    </button>
                                                ))}
                                                <button 
                                                    onClick={() => footwearInputRef.current?.click()}
                                                    className="aspect-square rounded-2xl border border-dashed border-zinc-200 flex items-center justify-center hover:border-indigo-400 transition-all cursor-pointer group/upload bg-zinc-50"
                                                >
                                                    <UploadCloud className="w-4 h-4 text-zinc-400 group-hover/upload:text-indigo-400 transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                   </div>
                </div>
             )}

             {activeStudio === 'Jewellery' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                   <SectionHeader title="Macro Hub" note="High-precision jewelry configuration" />
                    <div className="space-y-5">
                        <div className="h-[150px]"><DropzoneSlot slotId="necklace" label="Necklace" icon={Gem} image={jewellery.necklace} onImageSet={(v) => setJewellery('necklace', v)} onRemove={() => setJewellery('necklace', null)} /></div>
                        <div className="h-[150px]"><DropzoneSlot slotId="watch" label="Watch" icon={Watch} image={jewellery.watch} onImageSet={(v) => setJewellery('watch', v)} onRemove={() => setJewellery('watch', null)} /></div>
                        <div className="h-[150px]"><DropzoneSlot slotId="ring" label="Rings" icon={Fingerprint} image={jewellery.ring} onImageSet={(v) => setJewellery('ring', v)} onRemove={() => setJewellery('ring', null)} /></div>
                    </div>
                </div>
             )}

             {activeStudio === 'Home' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                    <SectionHeader title="Interior Floor" note="Luxury furniture and decor assets" />
                    <div className="space-y-6">
                        <div className="h-[210px]"><DropzoneSlot slotId="furniture" label="Forniture" icon={Sofa} image={homeAssets.furniture} onImageSet={(v) => setHomeAsset('furniture', v)} onRemove={() => setHomeAsset('furniture', null)} /></div>
                        <div className="h-[210px]"><DropzoneSlot slotId="lighting" label="Lighting" icon={Lamp} image={homeAssets.lighting} onImageSet={(v) => setHomeAsset('lighting', v)} onRemove={() => setHomeAsset('lighting', null)} /></div>
                        <div className="h-[210px]"><DropzoneSlot slotId="decor" label="Decor items" icon={ImageIcon} image={homeAssets.decor} onImageSet={(v) => setHomeAsset('decor', v)} onRemove={() => setHomeAsset('decor', null)} /></div>
                    </div>
                </div>
             )}

             {activeStudio === 'Pets' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                   <SectionHeader title="Pet Studio" note="Animal fashion and breed profiling" />
                   <div className="space-y-6">
                        <div className="h-[210px]"><DropzoneSlot slotId="breed" label="Breed Ref" icon={Dog} image={petAssets.breed} onImageSet={(v) => setPetAsset('breed', v)} onRemove={() => setPetAsset('breed', null)} /></div>
                        <div className="h-[210px]"><DropzoneSlot slotId="outfit" label="Animal Vest" icon={Shirt} image={petAssets.outfit} onImageSet={(v) => setPetAsset('outfit', v)} onRemove={() => setPetAsset('outfit', null)} /></div>
                        <div className="h-[210px]"><DropzoneSlot slotId="accessory" label="Accessory" icon={Cat} image={petAssets.accessory} onImageSet={(v) => setPetAsset('accessory', v)} onRemove={() => setPetAsset('accessory', null)} /></div>
                   </div>
                </div>
             )}

          </div>

          <section className="flex-1 flex flex-col items-center justify-start h-full">
             <div className={`relative w-full rounded-[48px] overflow-hidden transition-all duration-1000 shadow-[0_50px_120px_rgba(0,0,0,0.06)] bg-white border border-zinc-200 ${finalImage ? 'ring-2 ring-indigo-50 scale-[1.02]' : 'opacity-40'}`}
                 style={{ aspectRatio: '3 / 4', maxWidth: '600px' }}>
              
              {!shotGallery[currentShot] && !isGenerating && !isBatchRunning && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-16 gap-10">
                    {generationError ? (
                       <div className="space-y-8 animate-in zoom-in duration-500">
                          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mx-auto">
                              <AlertCircle className="w-10 h-10 text-red-500" />
                          </div>
                          <div className="space-y-3">
                              <p className="text-red-500 font-black tracking-[.6em] uppercase text-[10px]">Synthesis Failed</p>
                              <p className="text-[12px] text-zinc-500 leading-relaxed font-bold max-w-[340px]">{generationError}</p>
                              <button onClick={() => setGenerationError(null)} className="text-[10px] text-zinc-400 underline uppercase mt-4">Dismiss and Retry</button>
                          </div>
                       </div>
                    ) : (
                       <>
                        <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-inner">
                            <Sparkles className={`w-8 h-8 ${canGenerate ? 'text-indigo-600 animate-pulse' : 'text-zinc-800'}`} />
                        </div>
                        <div className="space-y-4">
                            <p className={`font-black tracking-[.6em] uppercase text-[10px] transition-colors ${canGenerate ? 'text-indigo-400' : 'text-zinc-600'}`}>
                                {canGenerate ? "Hub Assets Initialized" : "Awaiting Hub Deployment"}
                            </p>
                            <p className="text-[11px] text-zinc-700 leading-relaxed font-black max-w-[300px]">
                                {canGenerate 
                                    ? "Neural pipeline is calibrated. Click 'Generate' below to begin capture." 
                                    : "Deploy your product assets to the hub on the left to trigger the engine."}
                            </p>
                        </div>
                       </>
                    )}
                 </div>
              )}

              {(isGenerating || isBatchRunning) && (
                <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center text-zinc-900 px-10 backdrop-blur-3xl animate-in fade-in duration-500">
                  <div className="relative mb-16">
                    <div className="w-48 h-48 rounded-full border border-zinc-100 flex items-center justify-center">
                        <div className="absolute inset-0 m-auto w-36 h-36 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin duration-700"></div>
                        <Wand2 className="w-10 h-10 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-6">
                    <h2 className="text-3xl font-black tracking-tighter italic text-zinc-900">
                        {isBatchRunning ? `Drafting Gallery: ${Math.floor(batchProgress)}%` : isGenerating === 'fix' ? 'Applying AI Retouch...' : `Spectral Synthesis...`}
                    </h2>
                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[.8em]">Lumina Core v7.0 Pro</p>
                  </div>
                </div>
              )}

              {shotGallery[currentShot] && (
                <NextImage 
                  src={shotGallery[currentShot]!} 
                  fill
                  priority
                  className="object-cover relative z-10 animate-in fade-in duration-1000" 
                  alt="Generated VTO Result"
                  sizes="(max-width: 1280px) 100vw, 800px"
                />
              )}
            </div>

            <div className={`mt-12 flex gap-4 w-full justify-center max-w-[600px] transition-all duration-700 ${finalImage ? 'opacity-0 translate-y-12' : 'opacity-100'}`}>
                <button 
                    onClick={() => handleGenerateShot('main')}
                    className={`h-16 px-10 rounded-[28px] font-black tracking-[.4em] text-[10px] flex items-center gap-4 uppercase transition-all shadow-xl
                    ${canGenerate ? "bg-black text-white hover:bg-zinc-800 active:scale-95 shadow-zinc-200" : "bg-zinc-100 text-zinc-300 cursor-not-allowed"}`}
                    disabled={!canGenerate || !!isGenerating || isBatchRunning}
                >
                    {isGenerating === 'main' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Hub Capture
                </button>

                <button 
                    onClick={gENERATE_aLL}
                    className={`h-16 px-10 rounded-[28px] font-black tracking-[.4em] text-[10px] flex items-center gap-4 uppercase transition-all shadow-xl
                    ${canGenerate ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95" : "bg-zinc-100 text-zinc-300 cursor-not-allowed"}`}
                    disabled={!canGenerate || !!isGenerating || isBatchRunning}
                >
                    <MonitorPlay className="w-4 h-4" />
                    Automate Full Catalog
                </button>
            </div>
          </section>

          <aside className="w-[380px] border-l border-zinc-200 bg-white/50 backdrop-blur-3xl px-8 py-10 flex flex-col gap-8 z-30 transition-all duration-700 no-scrollbar overflow-y-auto">
             <div className="flex items-center gap-3">
                <LayoutPanelLeft className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black text-zinc-900 uppercase tracking-[.4em]">Result History</h3>
             </div>

             <div className="flex-1 grid grid-cols-2 gap-4 no-scrollbar pr-1 content-start">
                {shots.map((shot) => (
                    <div key={shot.id} className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest truncate">{shot.label}</span>
                            {!shotGallery[shot.id] && canGenerate && (
                                <button 
                                    onClick={() => handleGenerateShot(shot.id)}
                                    className="p-1 px-1.5 rounded bg-white border border-zinc-200 text-[7px] font-bold text-zinc-400 hover:text-indigo-600 hover:border-indigo-300 transition-all uppercase shadow-sm"
                                    disabled={!!isGenerating || isBatchRunning}
                                >
                                    Gen
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={() => shotGallery[shot.id] && setCurrentShot(shot.id)}
                            className={`w-full aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden relative group
                            ${shotGallery[shot.id] 
                                ? (currentShot === shot.id ? "border-indigo-600 shadow-xl shadow-indigo-100" : "border-zinc-100 hover:border-zinc-200") 
                                : "border-dashed border-zinc-200 bg-zinc-50"}`}
                        >
                            {shotGallery[shot.id] ? (
                                <div className="absolute inset-0">
                                    <NextImage 
                                      src={shotGallery[shot.id]!} 
                                      fill
                                      className="object-cover" 
                                      alt={shot.label} 
                                      sizes="200px"
                                    />
                                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Layers className="w-4 h-4 text-indigo-600" />
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden group-hover:flex absolute inset-0 items-center justify-center bg-black/60 backdrop-blur-sm transition-all text-[7px] font-black text-zinc-600 uppercase">
                                    Empty
                                </div>
                            )}
                        </button>
                    </div>
                ))}
             </div>

             <div className="pt-6 border-t border-zinc-100">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col gap-3">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Catalog Sync</p>
                    <div className="flex items-center gap-2">
                        {[1,2,3,4].map(idx => (
                            <div key={idx} className={`w-2 h-2 rounded-full ${shotGallery[shots[idx-1].id] ? "bg-indigo-600 animate-pulse" : "bg-zinc-200"}`} />
                        ))}
                    </div>
                </div>
             </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
