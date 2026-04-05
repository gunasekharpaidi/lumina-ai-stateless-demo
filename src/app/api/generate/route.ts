import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY || '' });

const parseBase64 = (dataUrl: string) => {
  const parts = dataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const base64Bytes = parts[1];
  return { mimeType, base64Bytes };
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { 
        activeStudio, apparelMode, garments, jewellery, homeAssets, petAssets, 
        modelConfig, selectedModelId, environment, customPrompt, shotType, referenceImage,
        mode, originalImage, maskImage, fixPrompt, assets
    } = payload;

    const MODEL_DETAILS: Record<string, any> = {
        // --- Young Adult (18-25: High-Fashion Fit) ---
        leo: { name: 'Leo', desc: 'Caucasian male, 22. Square jaw, high cheekbones. **Silhouette DNA**: Toned athletic build, broad shoulders, lean frame.' },
        kenji: { name: 'Kenji', desc: 'Asian male, 24, Japanese. Defined jawline, high-bridged nose. **Silhouette DNA**: Lean athletic build, slender frame.' },
        aaliyah: { name: 'Aaliyah', desc: 'Black female, 21, African. Heart-shaped face, high forehead, rich dark skin. **Silhouette DNA**: Lean lithe physique, long elegant limbs.' },
        priya: { name: 'Priya', desc: 'South Asian female, 23, Indian. Large almond eyes, sharp nose, honey skin. **Silhouette DNA**: Slender high-fashion build, graceful neck.' },
        
        // --- Mid-Age (30-45: Realistic Diversity) ---
        mateo: { name: 'Mateo', desc: 'Hispanic male, 35, Latino. Rugged heart-shaped face. **Silhouette DNA**: Natural average build, realistic proportions, non-muscular natural frame.' },
        omar: { name: 'Omar', desc: 'Middle Eastern male, 38, Arab. Strong brow, groomed beard. **Silhouette DNA**: Solid, sturdy, slightly stocky build, broad-chested.' },
        elena: { name: 'Elena', desc: 'Caucasian female, 32, European. Sculpted cheekbones, fair glowing skin. **Silhouette DNA**: Average slender build, realistic woman proportions, not overly thin.' },
        mei: { name: 'Mei', desc: 'Asian female, 34, Chinese. Elegant jawline, porcelain skin. **Silhouette DNA**: Average rectangular build, natural proportions, graceful symmetry.' },
        
        // --- Old-Age (55+: Mature Realism) ---
        arthur: { name: 'Arthur', desc: 'Caucasian male, 62, British. Silver hair, refined wrinkles. **Silhouette DNA**: Sturdy mature frame, average height, slightly softened shoulders.' },
        raj: { name: 'Raj', desc: 'South Asian male, 65, Indian. Salt-and-pepper mustache, wise features. **Silhouette DNA**: Average-to-sturdy mature frame, natural realistic grandfatherly silhouette.' },
        zora: { name: 'Zora', desc: 'Black female, 60, African American. Silver curly hair, warm smile. **Silhouette DNA**: Graceful fuller mature figure, natural curvy proportions, elegant and wise.' },
        sofia: { name: 'Sofia', desc: 'Hispanic female, 58, Spanish. Brunette with silver streaks. **Silhouette DNA**: Softened average build, realistic mature woman proportions.' },
        
        // --- Kids (5-12) ---
        toby: { name: 'Toby', desc: 'Caucasian boy, 8. Bright blue eyes, fair skin. **Silhouette DNA**: Energetic slender boyish build.' },
        wei: { name: 'Wei', desc: 'Asian boy, 7. Round face, dark eyes, fair skin. **Silhouette DNA**: Energetic average boyish build.' },
        ananya: { name: 'Ananya', desc: 'South Asian girl, 9. Long dark hair, big eyes, honey skin tone. **Silhouette DNA**: Graceful slender girl build.' },
        imani: { name: 'Imani', desc: 'Black girl, 8. Braided hair, brown skin tone. **Silhouette DNA**: Energetic average girl build.' },

        // --- Infants (0-2) ---
        noah: { name: 'Noah', desc: 'Mixed heritage infant, 1. Round chubby cheeks, fair skin. **Silhouette DNA**: Healthy chubby infant build.' },
        chloe: { name: 'Chloe', desc: 'Caucasian infant, 1. Soft blonde hair, blue eyes. **Silhouette DNA**: Soft healthy infant build.' },

        // --- Indian Expansion (South Asian - High Realism) ---
        arjun: { name: 'Arjun', desc: 'Indian male, 24. Sharp jaw, athletic build, intense eyes. **Silhouette DNA**: Toned athletic frame, lean musculature.' },
        isha: { name: 'Isha', desc: 'Indian female, 22. Modern heart-shaped face, high cheekbones. **Silhouette DNA**: Slender urban physique, graceful proportions.' },
        vikram: { name: 'Vikram', desc: 'Indian male, 36. Heart-shaped face, groomed beard. **Silhouette DNA**: Average professional Indian build, slightly softened waistline, natural proportions.' },
        kavya: { name: 'Kavya', desc: 'Indian female, 32. Anatomical features: Sharp heart-shaped face, high-bridged nose. **Silhouette DNA**: Graceful curvy build, realistic hourglass for mid-age, fuller figure, elegant and mature.' },
        dev: { name: 'Dev', desc: 'Indian male, 60. Distinguished silver hair, wise lined features. **Silhouette DNA**: Average-to-sturdy mature Indian build, dignified posture.' },
        sia: { name: 'Sia', desc: 'Indian girl, 9. Traditional Indian features, long braided hair. **Silhouette DNA**: Graceful slender girl proportions.' }
    };

    // --- Mode: AI SMART SUGGESTIONS (COMPARATIVE AUDIT) ---
    if (mode === 'suggest' && originalImage) {
        console.log(`Analyzing ${shotType} image for professional comparative audit suggestions...`);
        const { mimeType: oMime, base64Bytes: oBytes } = parseBase64(originalImage);
        
        const mediaParts: any[] = [{ inlineData: { data: oBytes, mimeType: oMime } }];
        if (assets && assets.length > 0) {
            assets.forEach((a: string) => {
                const { mimeType, base64Bytes } = parseBase64(a);
                mediaParts.push({ inlineData: { data: base64Bytes, mimeType } });
            });
        }

        const auditPrompt = `ACT AS A SENIOR QUALITY CONTROL AUDITOR focusing on a [${shotType.toUpperCase()}] shot.
          
          IMAGE 1: Current [${shotType}] result.
          IMAGES 2+: Original reference assets.
          
          YOUR TASK: Identify mismatches specifically for a ${shotType} perspective.
          
          ${shotType === 'closeup' ? "PRIORITY: TEXTILE FIDELITY. Focus on fabric weave, stitching, pattern alignment, and literal material matching." : "PRIORITY: SILHOUETTE & SCALE. Focus on fit, length, and how the garment sits on the 3D forms of the model from this angle."}
          
          OUTPUT ONLY A JSON ARRAY OF STRINGS (3-5 suggestions).`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-image-preview',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: auditPrompt },
                        ...mediaParts
                    ]
                }
            ]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
        try {
            const cleanJson = text.replace(/```json|```/g, '').trim();
            const suggestions = JSON.parse(cleanJson);
            return NextResponse.json({ success: true, suggestions });
        } catch (e) {
            return NextResponse.json({ success: true, suggestions: ["Reduce scale of the bottom garment", "Align pattern to match reference grid", "Correct the fabric color drift"] });
        }
    }

    // --- Mode: AI CANVAS FIXER (STRONG RESTRUCTURING ENGINE) ---
    if (mode === 'fix' && originalImage && maskImage) {
        console.log(`Executing Strong ${shotType} AI Canvas Fixer Sync...`);
        const { mimeType: oMime, base64Bytes: oBytes } = parseBase64(originalImage);
        const { mimeType: mMime, base64Bytes: mBytes } = parseBase64(maskImage);

        // Detect if this is a structural fix (size/scale/fit)
        const isStructural = /size|scale|big|small|fit|short|long|length|waist/i.test(fixPrompt);

        const fixInstruction = `ACT AS A PIXEL-PERFECT ART RETOUCHER AND DIGITAL TAILOR.
        THE SHOT: This is a [${shotType.toUpperCase()}] perspective.
        IMAGE A: The original generated result.
        IMAGE B: A black and white mask where WHITE represents the area to be REPLACED/FIXED.
        
        TASK:
        Modify ONLY the area defined by the white mask in Image B.
        Within that white area, implement this fix: [${fixPrompt}].
        
        ${isStructural ? `ATTENTION: This is a STRUCTURAL RESHAPING task for a ${shotType} view. Prioritize changing the SILHOUETTE and SCALE of the item according to the 3D perspective of this angle.` : "Maintain the existing silhouette and focus on texture/alignment."}
        
        CRITICAL CONSTRAINTS:
        1. PERSPECTIVE: The new pixels MUST follow the 3D form of the ${shotType} camera angle.
        2. Bit-for-Bit Consistency: Every pixel in the BLACK area of the mask MUST remain identical to Image A.
        3. Seamless Blending: The corrected area must blend perfectly with the original lighting and texture.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-image-preview',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: fixInstruction },
                        { inlineData: { data: oBytes, mimeType: oMime } },
                        { inlineData: { data: mBytes, mimeType: mMime } }
                    ]
                }
            ],
            config: { responseModalities: ["IMAGE"], aspectRatio: "3:4" } as any
        });

        const candidate = response.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find((p: any) => p.inlineData);

        if (imagePart && imagePart.inlineData) {
            return NextResponse.json({ 
                success: true, 
                generatedImage: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
                message: "Strong Retouching Synchronized" 
            });
        }
        throw new Error("Retouching engine failed to produce a valid candidate.");
    }

    // --- Mode: RADICAL SHOT GENERATION ---
    const analyzeAssetDNA = async (base64Url: string, label: string) => {
        try {
            const { mimeType, base64Bytes } = parseBase64(base64Url);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: `TECHNICAL TEXTILE AUDIT: 
                              Act as a meticulously detailed textile engineer. For this ${label}, provide a LITERAL PIXEL-LEVEL BLUEPRINT:
                              1. PATTERN PITCH: Describe the frequency and repeat-cycle of the pattern (e.g., "The plaid grid repeats every 3cm").
                              2. CHROMATIC LAYERING: List the EXACT colors of the crossing lines (e.g., "Forest Green #228B22 lines crossing Red #D22B2B base").
                              3. SCALE MAP: Describe the width of the individual stripes (Thin 1mm green vs Thick 10mm red).
                              4. WEAVE DENSITY: Describe the weave (Flannel, Poplin, Twill).
                              
                              CRITICAL: Your description will be used as a literal digital twin blueprint. No creative interpretation.` 
                            },
                            { inlineData: { data: base64Bytes, mimeType } }
                        ]
                    }
                ]
            });
            const result = await response;
            return result.text || "Generic professional product asset.";
        } catch (e) {
            console.warn(`DNA Analysis failed for ${label}, falling back.`, e);
            return `A professional ${label} with standard material and structural design.`;
        }
    }

    let assetSpecs = "";
    const mediaParts: any[] = [];
    const addToMedia = (url: string) => {
        const { mimeType, base64Bytes } = parseBase64(url);
        mediaParts.push({ inlineData: { data: base64Bytes, mimeType } });
    }

    const analysisPromises: Promise<string>[] = [];
    const labels: string[] = [];
    
    const trackAnalysis = (url: string, label: string) => {
        labels.push(label);
        analysisPromises.push(analyzeAssetDNA(url, label));
        addToMedia(url);
    }

    if (activeStudio === 'Apparel') {
        if (apparelMode === 'separates') {
            if (garments.top) trackAnalysis(garments.top, 'upper garment');
            if (garments.bottom) trackAnalysis(garments.bottom, 'lower garment');
        } else if (apparelMode === 'dress' || apparelMode === 'saree') {
            const label = apparelMode === 'saree' ? 'traditional saree' : 'one-piece outfit';
            if (garments.dress) trackAnalysis(garments.dress, label);
        } else if (apparelMode === 'laydown') {
            if (garments.top) trackAnalysis(garments.top, 'flat-lay garment');
            if (garments.dress) trackAnalysis(garments.dress, 'flat-lay garment');
        }
        if (garments.shoes) trackAnalysis(garments.shoes, 'footwear');
    } 
    else if (activeStudio === 'Jewellery') {
        if (jewellery.necklace) trackAnalysis(jewellery.necklace, 'necklace');
        if (jewellery.ring) trackAnalysis(jewellery.ring, 'ring');
        if (jewellery.watch) trackAnalysis(jewellery.watch, 'watch');
    }
    else if (activeStudio === 'Home') {
        if (homeAssets.furniture) trackAnalysis(homeAssets.furniture, 'furniture');
        if (homeAssets.decor) trackAnalysis(homeAssets.decor, 'decor');
        if (homeAssets.lighting) trackAnalysis(homeAssets.lighting, 'lighting');
    }
    else if (activeStudio === 'Pets') {
        if (petAssets.breed) trackAnalysis(petAssets.breed, 'animal breed reference');
        if (petAssets.outfit) trackAnalysis(petAssets.outfit, 'animal clothing');
        if (petAssets.accessory) trackAnalysis(petAssets.accessory, 'animal accessory');
    }

    const completedSpecs = await Promise.all(analysisPromises);
    completedSpecs.forEach((spec, i) => { assetSpecs += `\n[${labels[i].toUpperCase()}]: ${spec}`; });

    const persona = selectedModelId ? MODEL_DETAILS[selectedModelId] : null;

    if (referenceImage) addToMedia(referenceImage);

    // Ultra-High Pattern Synchronizer Prompt
    let hubInstruction = "";
    let cameraFocus = "MANDATORY FULL-BODY SHOT. Ensure the ENTIRE model is framed perfectly within the image. DO NOT CROP the top of the head. DO NOT CROP the shoes. Maintain at least 15% negative space at the vertical edges.";
    
    if (activeStudio === 'Apparel') {
        if (apparelMode === 'laydown') {
            hubInstruction = "ACT AS A PROFESSIONAL PRODUCT PHOTOGRAPHER. Create a clean, elegant FLAT-LAY or GHOST MANNEQUIN photography shot of the garment on a minimalist surface. No human model should be visible.";
            cameraFocus = "Flat-lay overhead or architectural angle.";
        } else if (apparelMode === 'saree') {
            hubInstruction = "ACT AS A HIGH-END FASHION TEXTILE PRINTER. Drape the provided saree asset on the model with traditional precision. Focus on pallu pleating, fabric grace, and literal pattern fidelity.";
        } else {
            hubInstruction = "ACT AS A PHOTOREALISTIC TEXTILE PRINTER. Replicate the provided garments with 100% LITERAL PATTERN FIDELITY. Match colors and grid pitch EXACTLY.";
        }
    } else {
        if (activeStudio === 'Jewellery') {
            hubInstruction = "PREMIUM JEWELLERY SHOWCASE. Focus on macro details and gemstone clarity.";
            cameraFocus = "Waist-up closeup.";
        } else if (activeStudio === 'Home') {
            hubInstruction = "LUXURY INTERIOR RENDERING.";
            cameraFocus = "Architectural interior shot.";
        } else if (activeStudio === 'Pets') {
            hubInstruction = "HIGH-END PET FASHION PHOTOGRAPHY.";
            cameraFocus = "Pet-level portrait.";
        }
    }

    // Radical Shot Precision Mapping
    if (apparelMode !== 'laydown' && shotType !== 'closeup') {
        if (shotType === 'side') {
            cameraFocus = "FULL-BODY SIDE PROFILE. Mandatory head-to-toe capture with clear silhouette and footwear visible.";
        } else if (shotType === 'pose') {
            cameraFocus = "FULL-BODY HERO ACTION. Ensure the entire model is active and fully in frame from head to shoes.";
        }
    } else if (shotType === 'closeup') {
        cameraFocus = "ULTRA-MACRO FABRIC CAPTURE. Ignore the full-body framing of any reference image. ZOOM IN EXTREMELY CLOSE (4x zoom) on the mid-section or sleeve to show litereal fabric weave, stitching details, and exact pattern pitch. The model's head and feet should NOT be visible in this shot.";
    }

    let envInstruction = "STANDARD E-COMMERCE STUDIO. Solid flat neutral grey background. Soft professional contact shadows on a solid floor. High-key flat lighting. Zero horizon lines or architectural clutter.";
    if (environment === 'Urban') envInstruction = "Modern city street, cinematic natural lighting.";
    if (environment === 'Nature') envInstruction = "Outdoor setting, soft sunlight.";
    if (environment === 'Luxury') envInstruction = "Elegant interior, sophisticated ambient lighting.";

    const vtoPrompt = `SYSTEM TASK: ${hubInstruction}
SHOT TYPE: ${shotType} - ${cameraFocus}

STRICT FRAMING REGIME: Ensure the model's face and footwear are fully visible. The crop must be a professional editorial center-frame. DO NOT CROP THE FEET OR THE TOP OF THE HEAD.

IDENTITY SYNCHRONIZER & SILHOUETTE ANCHOR:
${(referenceImage && apparelMode !== 'laydown') ? "THIS IS THE MASTER REFERENCE IMAGE. The model's face, hair, body structure, and garment fit MUST be 100% identical to the person in the provided reference image. ZERO DEVIATION ALLOWED." : apparelMode === 'laydown' ? "No human model. Focus only on the garment presentation." : `MANDATORY PERSONA REPLICATION: You are generating the specific Lumina Model: [${persona?.name || 'Custom Persona'}]. 
  SACRED PHYSICAL IDENTITY BLUEPRINT: ${persona?.desc || `Ethnicity: ${modelConfig.ethnicity}, Age: ${modelConfig.age}, Skin Tone: ${modelConfig.skinTone}`}. 
  SILHOUETTE ANCHOR: Strictly replicate the [Silhouette DNA] defined in the blueprint (e.g., Curvy, Sturdy, Average). DO NOT default to a slim model build. The skeletal and muscular frame must be identical to the blueprint.`}

[MASTER FABRIC BLUEPRINT]:
${assetSpecs}
STRICT LOGIC REQUIREMENT: The pattern, pitch, and scale of the garments above are 100% IT'S LITERAL AND MANDATORY. Do not deviate by even 1%. This is a digital-twin render task.

[SAREE MASTER-DRAPE - ANATOMICAL ANCHOR: ${apparelMode === 'saree' ? 'PRIMARY' : 'OFF'}]:
${apparelMode === 'saree' ? `
CRITICAL: REPLICATE THE [BROAD SHOT] INPUT WITH 100% PATTERN FIDELITY. 
SAREE COMPONENT SCANNING:
1. ZONE A (ZARI & BORDER): Replicate the exact thickness, gold/silver metallic sheen, and intricate weave of the border from the reference.
2. ZONE B (MAIN BODY & BUTTAS): Detect the exact density, shape, and frequency of motifs. Replicate their placement across the entire drape.
3. ZONE C (PALLU & FALL): The decorative 'Pallu' (end piece) must be draped elegantly over the shoulder, showing its high-detail pattern. The 'Fall' at the bottom must show realistic weight and crisp pleats.
FABRIC PHYSICS: Ensure the material reflects its natural light-handling and weight. ZERO pattern drift allowed.` : ""}

${apparelMode !== 'laydown' ? `MODEL PERSONA: 
- Ethnicity: ${modelConfig.ethnicity} | Skin Tone: ${modelConfig.skinTone}
- Age Focus: ${modelConfig.age} years | Category: ${modelConfig.gender}` : ""}

SCENE: ${envInstruction} ${customPrompt ? `| STYLE: ${customPrompt}` : ""}
OUTPUT: 8k digital twin render, pixel-perfect pattern mapping, professional fashion lens. Zero-mismatch garment structural integrity.`;

    const modelIds = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image-preview'];
    let lastError: any = null;

    for (const modelId of modelIds) {
        try {
            console.log(`Executing ${activeStudio} ${apparelMode} via ${modelId}...`);
            const response = await ai.models.generateContent({
                model: modelId,
                contents: [{ role: 'user', parts: [ { text: vtoPrompt }, ...mediaParts ] }],
                config: { responseModalities: ["IMAGE"], aspectRatio: "3:4" } as any
            });

            const candidate = response.candidates?.[0];
            const imagePart = candidate?.content?.parts?.find((p: any) => p.inlineData);

            if (imagePart && imagePart.inlineData) {
                return NextResponse.json({ 
                    success: true, 
                    generatedImage: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
                    message: `Rendered via ${modelId}` 
                });
            }
            throw new Error(`Generation yielded no valid image candidate on ${modelId}. Safety filter or content restriction may be blocking the result.`);
        } catch (err: any) {
            console.error(`Error (${modelId}):`, err.message);
            lastError = err;
            continue;
        }
    }

    return NextResponse.json({ success: false, error: lastError?.message || "Internal Synthesis Pipeline Failure." }, { status: 500 });

  } catch (error: any) {
    console.error("VTO API Pipeline Error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
