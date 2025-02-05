import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface ProductRecommendation {
  productId: number;
  reason: string;
  score: number;
}

export async function getPersonalizedRecommendations(
  userPreferences: Record<string, any>,
  shoppingHistory: any[],
  availableProducts: any[]
): Promise<ProductRecommendation[]> {
  try {
    // Create a prompt that includes user preferences and history
    const prompt = `
    As a shopping assistant, analyze the following user data and available products to provide personalized recommendations.
    
    User Preferences:
    ${JSON.stringify(userPreferences, null, 2)}
    
    Shopping History:
    ${JSON.stringify(shoppingHistory, null, 2)}
    
    Available Products:
    ${JSON.stringify(availableProducts, null, 2)}
    
    Based on this information, recommend 5 products that this user might be interested in.
    For each recommendation, provide:
    1. The product ID
    2. A reason for the recommendation in Hebrew
    3. A confidence score between 0 and 1
    
    Respond in the following JSON format:
    [
      {
        "productId": number,
        "reason": "string",
        "score": number
      }
    ]
    `;

    // Get response from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response
    const recommendations = JSON.parse(text) as ProductRecommendation[];
    
    // Validate and clean up recommendations
    return recommendations
      .filter(rec => 
        typeof rec.productId === 'number' &&
        typeof rec.reason === 'string' &&
        typeof rec.score === 'number' &&
        rec.score >= 0 &&
        rec.score <= 1
      )
      .slice(0, 5); // Ensure we only return max 5 recommendations

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

export async function analyzeShoppingTrends(
  shoppingHistory: any[]
): Promise<string> {
  try {
    const prompt = `
    Analyze the following shopping history and provide insights about shopping patterns and trends.
    Please write the analysis in Hebrew.
    
    Shopping History:
    ${JSON.stringify(shoppingHistory, null, 2)}
    
    Focus on:
    1. Most frequently bought items
    2. Shopping patterns (time, frequency)
    3. Price sensitivity
    4. Category preferences
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error analyzing shopping trends:', error);
    return 'לא ניתן היה לנתח את דפוסי הקניה כרגע.';
  }
}
