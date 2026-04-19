import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates financial insights and visualization recommendations using Gemini AI.
 * @param {Array} data - The dataset to analyze
 * @param {Array} columns - The columns available in the data
 * @returns {Promise<Object>} - An object containing insights and chart suggestions
 */
export const getAIInsights = async (data, columns) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare a compact summary of the data (Gemini token limits)
    // We take the head and a few middle/tail rows to give a representative sample
    const sampleSize = 10;
    const sampleData = data.slice(0, sampleSize);
    
    const prompt = `
      You are a senior Financial Data Analyst AI. 
      Analyze the following dataset summary and provide professional insights.
      
      COLUMNS: ${columns.join(", ")}
      DATA SAMPLE (First ${sampleSize} rows):
      ${JSON.stringify(sampleData, null, 2)}
      
      TOTAL RECORDS: ${data.length}

      PLEASE PROVIDE:
      1. **Executive Summary**: A 2-3 sentence overview of what this data represents.
      2. **Key Trends**: Identify at least 2 significant patterns or trends.
      3. **Anomalies/Outliers**: Point out any data points that seem unusual or incorrect.
      4. **Chart Recommendations**: Suggest the 2 most effective chart types for this specific data from these options: Bar Chart, Line Chart, Pie Chart, Area Chart. Explain why for each.
      5. **Business Recommendation**: One actionable advice based on this data.

      FORMATTING:
      - Use professional, concise language.
      - Use Markdown for bullet points and bold text.
      - Keep the total response under 400 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate AI insights. Please check your API key and connection.");
  }
};
