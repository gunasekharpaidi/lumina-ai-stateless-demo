import { create } from 'zustand'

export type ApparelMode = 'separates' | 'dress' | 'saree' | 'laydown';
export type Gender = 'Male' | 'Female' | 'Kid' | 'Infant';
export type Ethnicity = 'Caucasian' | 'Black' | 'Asian' | 'Hispanic' | 'Middle Eastern' | 'South Asian';
export type SkinTone = 'Porcelain' | 'Fair' | 'Olive' | 'Tan' | 'Brown' | 'Rich Dark';
export type ShotType = 'main' | 'side' | 'pose' | 'closeup';
export type Environment = 'Studio' | 'Urban' | 'Nature' | 'Luxury';
export type StudioType = 'Apparel' | 'Jewellery' | 'Home' | 'Pets';

export interface ModelPersona {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  ethnicity: Ethnicity;
  skinTone: SkinTone;
  features: string;
  thumbnail: string;
}

export const LEO_HEADSHOT = "/assets/models/leo.png";

export const MODEL_LIBRARY: ModelPersona[] = [
  // Young Adult (18-25)
  { id: 'leo', name: 'Leo', gender: 'Male', age: 22, ethnicity: 'Caucasian', skinTone: 'Fair', features: 'Square jaw, athletic build, high cheekbones, dark hair', thumbnail: LEO_HEADSHOT },
  { id: 'kenji', name: 'Kenji', gender: 'Male', age: 24, ethnicity: 'Asian', skinTone: 'Fair', features: 'Japanese descent, defined jawline, modern undercut, lean build', thumbnail: '/assets/models/kenji.png' },
  { id: 'aaliyah', name: 'Aaliyah', gender: 'Female', age: 21, ethnicity: 'Black', skinTone: 'Rich Dark', features: 'African descent, natural curly hair, elegant neck, high forehead', thumbnail: '/assets/models/aaliyah.png' },
  { id: 'priya', name: 'Priya', gender: 'Female', age: 23, ethnicity: 'South Asian', skinTone: 'Tan', features: 'Indian descent, large almond eyes, sharp nose, classic draped face', thumbnail: '/assets/models/priya.png' },
  
  // Mid-Age (30-45)
  { id: 'mateo', name: 'Mateo', gender: 'Male', age: 35, ethnicity: 'Hispanic', skinTone: 'Olive', features: 'Latino descent, rugged stubble, professional build, dark eyes', thumbnail: '/assets/models/mateo.png' },
  { id: 'omar', name: 'Omar', gender: 'Male', age: 38, ethnicity: 'Middle Eastern', skinTone: 'Tan', features: 'Arab descent, strong brow, groomed beard, sophisticated look', thumbnail: '/assets/models/omar.png' },
  { id: 'elena', name: 'Elena', gender: 'Female', age: 32, ethnicity: 'Caucasian', skinTone: 'Fair', features: 'European descent, high cheekbones, blonde/light hair, editorial look', thumbnail: '/assets/models/elena.png' },
  { id: 'mei', name: 'Mei', gender: 'Female', age: 34, ethnicity: 'Asian', skinTone: 'Porcelain', features: 'Chinese descent, elegant jaw, small features, professional symmetry', thumbnail: '/assets/models/mei.png' },
  
  // Old-Age (55+)
  { id: 'arthur', name: 'Arthur', gender: 'Male', age: 62, ethnicity: 'Caucasian', skinTone: 'Fair', features: 'British descent, silver hair, distinguished wrinkles, classic build', thumbnail: '/assets/models/arthur.png' },
  { id: 'raj', name: 'Raj', gender: 'Male', age: 65, ethnicity: 'South Asian', skinTone: 'Brown', features: 'Indian descent, salt-and-pepper mustache, wise eyes, mature build', thumbnail: '/assets/models/raj.png' },
  { id: 'zora', name: 'Zora', gender: 'Female', age: 60, ethnicity: 'Black', skinTone: 'Rich Dark', features: 'African American descent, silver curly hair, warm smile, elegant posture', thumbnail: '/assets/models/zora.png' },
  { id: 'sofia', name: 'Sofia', gender: 'Female', age: 58, ethnicity: 'Hispanic', skinTone: 'Tan', features: 'Spanish descent, brunette with silver streaks, high cheekbones, classy', thumbnail: '/assets/models/sofia.png' },
  
  // Kids (5-12)
  { id: 'toby', name: 'Toby', gender: 'Kid', age: 8, ethnicity: 'Caucasian', skinTone: 'Fair', features: 'English boy, bright eyes, messy blonde hair, energetic build', thumbnail: '/assets/models/toby.png' },
  { id: 'wei', name: 'Wei', gender: 'Kid', age: 7, ethnicity: 'Asian', skinTone: 'Fair', features: 'East Asian boy, round face, intelligent eyes, energetic', thumbnail: '/assets/models/wei.png' },
  { id: 'ananya', name: 'Ananya', gender: 'Kid', age: 9, ethnicity: 'South Asian', skinTone: 'Tan', features: 'Indian girl, long dark hair, big eyes, confident posture', thumbnail: '/assets/models/ananya.png' },
  { id: 'imani', name: 'Imani', gender: 'Kid', age: 8, ethnicity: 'Black', skinTone: 'Brown', features: 'African girl, braided hair, joyful expression, clean skin', thumbnail: '/assets/models/imani.png' },
  
  // Infants (0-2)
  { id: 'noah', name: 'Noah', gender: 'Infant', age: 1, ethnicity: 'Caucasian', skinTone: 'Fair', features: 'Mixed heritage, round cheeks, happy baby features', thumbnail: '/assets/models/noah.png' },
  { id: 'chloe', name: 'Chloe', gender: 'Infant', age: 1, ethnicity: 'Caucasian', skinTone: 'Porcelain', features: 'Caucasian girl, soft hair, bright blue eyes', thumbnail: '/assets/models/chloe.png' },
  // Indian Expansion (South Asian)
  { id: 'arjun', name: 'Arjun', gender: 'Male', age: 24, ethnicity: 'South Asian', skinTone: 'Brown', features: 'Indian male, sharp jaw, athletic build, short dark groomed hair, intense eyes', thumbnail: '/assets/models/arjun.png' },
  { id: 'isha', name: 'Isha', gender: 'Female', age: 22, ethnicity: 'South Asian', skinTone: 'Olive', features: 'Indian female, modern urban look, high cheekbones, expressive eyes, long dark hair', thumbnail: '/assets/models/isha.png' },
  { id: 'vikram', name: 'Vikram', gender: 'Male', age: 36, ethnicity: 'South Asian', skinTone: 'Tan', features: 'Indian male, professional corporate aesthetic, clean groomed beard, sophisticated', thumbnail: '/assets/models/vikram.png' },
  { id: 'kavya', name: 'Kavya', gender: 'Female', age: 32, ethnicity: 'South Asian', skinTone: 'Brown', features: 'Indian female, traditional elegance, long wavy hair, high-fashion poise, graceful neck', thumbnail: '/assets/models/kavya.png' },
  { id: 'dev', name: 'Dev', gender: 'Male', age: 60, ethnicity: 'South Asian', skinTone: 'Brown', features: 'Indian male, old age, distinguished silver-haired professional, wise features, classic posture', thumbnail: '/assets/models/dev.png' },
  { id: 'sia', name: 'Sia', gender: 'Kid', age: 9, ethnicity: 'South Asian', skinTone: 'Tan', features: 'Indian girl, graceful student, traditional features, long braided hair', thumbnail: '/assets/models/sia.png' },
];

export interface Garments {
  top: string | null;
  bottom: string | null;
  dress: string | null;
  shoes: string | null;
}

export interface Jewellery {
  necklace: string | null;
  ring: string | null;
  watch: string | null;
}

export interface HomeAssets {
  furniture: string | null;
  decor: string | null;
  lighting: string | null;
}

export interface PetAssets {
  breed: string | null;
  outfit: string | null;
  accessory: string | null;
}

export interface ModelConfig {
  gender: Gender;
  age: number;
  ethnicity: Ethnicity;
  skinTone: SkinTone;
}

interface StudioState {
  activeStudio: StudioType;
  apparelMode: ApparelMode;
  garments: Garments;
  jewellery: Jewellery;
  homeAssets: HomeAssets;
  petAssets: PetAssets;
  
  modelConfig: ModelConfig;
  selectedModelId: string | null;
  environment: Environment;
  
  finalImage: string | null;
  shotGallery: Record<string, string | null>;
  currentShot: ShotType;
  
  customPrompt: string;
  
  // Actions
  setActiveStudio: (studio: StudioType) => void;
  setApparelMode: (mode: ApparelMode) => void;
  setGarment: (slot: keyof Garments, imageBase64: string | null) => void;
  setJewellery: (slot: keyof Jewellery, imageBase64: string | null) => void;
  setHomeAsset: (slot: keyof HomeAssets, imageBase64: string | null) => void;
  setPetAsset: (slot: keyof PetAssets, imageBase64: string | null) => void;
  
  setModelConfig: (key: keyof ModelConfig, value: any) => void;
  setSelectedModelId: (id: string | null) => void;
  setEnvironment: (env: Environment) => void;
  
  setFinalImage: (image: string | null) => void;
  setShot: (type: ShotType, image: string | null) => void;
  setCurrentShot: (type: ShotType) => void;
  
  setCustomPrompt: (prompt: string) => void;
  resetAll: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  activeStudio: 'Apparel',
  apparelMode: 'separates',
  garments: { top: null, bottom: null, dress: null, shoes: null },
  jewellery: { necklace: null, ring: null, watch: null },
  homeAssets: { furniture: null, decor: null, lighting: null },
  petAssets: { breed: null, outfit: null, accessory: null },
  
  modelConfig: { gender: 'Female', age: 25, ethnicity: 'Caucasian', skinTone: 'Fair' },
  selectedModelId: null,
  environment: 'Studio',
  
  finalImage: null,
  shotGallery: { main: null, side: null, pose: null, closeup: null },
  currentShot: 'main',
  
  customPrompt: "",
  
  setActiveStudio: (studio) => set({ activeStudio: studio }),
  setApparelMode: (mode) => set({ apparelMode: mode }),
  setGarment: (slot, imageBase64) => set((state) => ({ garments: { ...state.garments, [slot]: imageBase64 } })),
  setJewellery: (slot, imageBase64) => set((state) => ({ jewellery: { ...state.jewellery, [slot]: imageBase64 } })),
  setHomeAsset: (slot, imageBase64) => set((state) => ({ homeAssets: { ...state.homeAssets, [slot]: imageBase64 } })),
  setPetAsset: (slot, imageBase64) => set((state) => ({ petAssets: { ...state.petAssets, [slot]: imageBase64 } })),
  
  setModelConfig: (key, value) => set((state) => ({ modelConfig: { ...state.modelConfig, [key]: value }, selectedModelId: null })),
  setSelectedModelId: (id) => set((state) => {
    if (!id) return { selectedModelId: null };
    const model = MODEL_LIBRARY.find(m => m.id === id);
    if (!model) return { selectedModelId: null };
    return {
        selectedModelId: id,
        modelConfig: {
            gender: model.gender,
            age: model.age,
            ethnicity: model.ethnicity,
            skinTone: model.skinTone
        }
    };
  }),
  setEnvironment: (env) => set({ environment: env }),
  
  setFinalImage: (image) => set((state) => ({ finalImage: image, shotGallery: { ...state.shotGallery, main: image } })),
  setShot: (type, image) => set((state) => ({ shotGallery: { ...state.shotGallery, [type]: image } })),
  setCurrentShot: (type) => set({ currentShot: type }),
  
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
  
  resetAll: () => set({ 
    garments: { top: null, bottom: null, dress: null, shoes: null },
    jewellery: { necklace: null, ring: null, watch: null },
    homeAssets: { furniture: null, decor: null, lighting: null },
    petAssets: { breed: null, outfit: null, accessory: null },
    finalImage: null,
    shotGallery: { main: null, side: null, pose: null, closeup: null },
    currentShot: 'main',
    customPrompt: "",
    environment: 'Studio',
    selectedModelId: null
  }),
}));
