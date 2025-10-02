
import { GoogleGenAI } from "@google/genai";
import type { FormData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (formData: FormData): string => {
  return `
You are an expert SEO specialist and meta tag optimizer with deep knowledge of Google's 2025 search algorithms. Your expertise includes:

- Creating compelling, click-worthy meta titles (50-60 characters, max 600 pixels desktop / 500 pixels mobile)
- Writing engaging meta descriptions (120-158 characters, max 920 pixels desktop / 680 pixels mobile)
- Analyzing webpage content and user intent
- Front-loading primary keywords for maximum impact
- Using power words and emotional triggers to increase CTR
- Ensuring mobile-first optimization
- Maintaining brand voice consistency

Your role is to:
1. Analyze the provided URL and content context
2. Evaluate current meta tags against SEO best practices
3. Calculate character counts and approximate pixel widths
4. Generate 3 optimized variations for both title and description
5. Provide clear rationale for each suggestion
6. Flag any SEO issues or missed opportunities

Always prioritize: relevance > engagement > keyword placement > length optimization

Analyze and optimize meta tags for the following webpage:

**URL:** ${formData.url}

**Current Meta Title:** ${formData.currentTitle}

**Current Meta Description:** ${formData.currentDescription}

**Target Keywords:** ${formData.keywords}

**Industry/Business Type:** ${formData.industry}

---

Please provide a comprehensive analysis in Markdown format with the following structure:

### 1. CURRENT META TAG ANALYSIS
- **Meta Title**: Character count, estimated pixel width, SEO score (1-10)
- **Meta Description**: Character count, estimated pixel width, SEO score (1-10)
- **Issues found**: List specific problems (too long, too short, missing keywords, weak CTA, etc.)
- **Strengths**: What's working well

### 2. OPTIMIZED META TITLE SUGGESTIONS (3 Variations)

**Option 1:** [Title - 50-60 chars]
- **Character Count:** [X]
- **Estimated Pixel Width:** [X pixels]
- **Rationale:** [Why this works - keyword placement, engagement factors, CTR optimization]

**Option 2:** [Title - 50-60 chars]
- **Character Count:** [X]
- **Estimated Pixel Width:** [X pixels]
- **Rationale:** [Why this works]

**Option 3:** [Title - 50-60 chars]
- **Character Count:** [X]
- **Estimated Pixel Width:** [X pixels]
- **Rationale:** [Why this works]

### 3. OPTIMIZED META DESCRIPTION SUGGESTIONS (3 Variations)

**Option 1:** [Description - 120-158 chars]
- **Character Count:** [X]
- **Estimated Pixel Width:** [X pixels]
- **Rationale:** [Why this works - includes CTA, benefits, keywords]

**Option 2:** [Description - 120-158 chars]
- **Character Count:** [X]
- **Estimated Pixel Width:** [X pixels]
- **Rationale:** [Why this works]

**Option 3:** [Description - 120-158 chars]
- **Character Count:** [X]
- **Estimated Pixel Width:** [X pixels]
- **Rationale:** [Why this works]

### 4. SEO RECOMMENDATIONS
- Primary keyword placement suggestions
- User intent alignment assessment
- Mobile display optimization tips
- A/B testing recommendations

### 5. PIXEL WIDTH CALCULATION NOTES
Explain how you estimated pixel widths based on character composition (wide letters like W, M vs narrow letters like i, l, t)

---

Ensure all suggestions are:
✓ Within optimal character limits
✓ Mobile-friendly (shorter is better)
✓ Front-loaded with important keywords
✓ Engaging with power words or emotional triggers
✓ Unique and not duplicated
✓ Natural and readable (not keyword-stuffed)
  `;
};

export const generateMetaTagAnalysis = async (formData: FormData): Promise<string> => {
  try {
    const prompt = buildPrompt(formData);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating meta tag analysis:", error);
    throw new Error("Failed to get analysis from AI. Please check your API key and try again.");
  }
};
