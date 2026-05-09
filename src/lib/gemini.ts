import { GoogleGenAI, Type } from "@google/genai";
import { RegenerationMode, RegenerationOutput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function regenerateText(text: string, modes: RegenerationMode[]): Promise<RegenerationOutput> {
  const modesString = modes.length > 0 ? modes.join(", ") : "Viral";
  const prompt = `
    You are REGEN, a premium AI text regenerator for social media content. 
    Your goal is to transform the following input text into viral, SEO-optimized content.
    
    TARGET MODES/STRATEGIES: ${modesString}
    
    INPUT TEXT:
    "${text}"
    
    GUIDELINES:
    1. VIRAL FOCUS: Create curiosity hooks and replay-worthy phrasing.
    2. INVISIBLE SEO: Use trending keywords naturally. SEO should feel invisible. Avoid stuffing keywords or sounding like an ad.
    3. MODERN TONE: Use a casual, effortless, Gen Z creator/fanpage tone. Use lowercase sometimes for aesthetic.
    4. HUMAN-LIKE: Sound like a real person on a FYP, not a corporate brand or ChatGPT.
    5. AVOID CLICKBAIT: No "Welcome to your premier destination" or "Cringe" robotic phrasing. 
    6. HYBRID APPROACH: Since multiple modes are selected (${modesString}), blend these styles seamlessly.
    
    REQUIRED OUTPUT STRUCTURE (JSON):
    - titles: Array of 10-15 unique viral titles. (e.g., "This edit feels straight out of TikTok")
    - captions: Array of 3-5 caption variations. (e.g., "still not over this edit 💫")
    - seoDescriptions: Array of 2-3 casual but SEO-friendly descriptions. 
      * CRITICAL: These must sound like real human captions, NOT marketing copy.
      * AVOID: "highest quality," "exclusive content," "premier destination."
      * PREFER: "just some of my favorite moments lately," "the vibes in this clip are actually perfect."
    - hashtags: Array of 15-20 trending and relevant hashtags.
    - hooks: Array of 5-8 strong, authentic opening hook lines.
    
    EXAMPLES OF GOOD TONE:
    - "amaya dawn really has one of the best aesthetics online"
    - "this edit has been stuck on my fyp all week"
    - "her energy makes every clip better honestly"
    
    EXAMPLES OF BAD TONE (STRICTLY FORBIDDEN):
    - "Welcome to our channel for the best compilation tips..."
    - "Viral TikTok compilation trending FYP edit shorts..."
    - "OMG SHE ATE THIS!!! Literally obsessed!"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            captions: { type: Type.ARRAY, items: { type: Type.STRING } },
            seoDescriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["titles", "captions", "seoDescriptions", "hashtags", "hooks"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      originalText: text,
      modes,
      titles: data.titles || [],
      captions: data.captions || [],
      seoDescriptions: data.seoDescriptions || [],
      hashtags: data.hashtags || [],
      hooks: data.hooks || [],
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Regeneration error:", error);
    throw new Error("Failed to regenerate text. Please check your input or try again.");
  }
}
