
import { Injectable, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Signal } from '../models/signal.model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  isLoading = signal(false);

  constructor() {
    try {
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      } else {
        console.warn("API_KEY environment variable not found. GeminiService will be disabled.");
      }
    } catch(e) {
      console.error("Error initializing GoogleGenAI", e);
    }
  }

  async getSignalExplanation(signal: Signal): Promise<string> {
    if (!this.ai) {
      return Promise.resolve("AI analysis is currently unavailable. Please ensure your API key is configured.");
    }

    this.isLoading.set(true);

    const prompt = `
      You are a trading analyst explaining a signal to a user of the Gourgel AI app.
      Explain the following binary options signal in a simple, educational, and encouraging tone.
      Do not mention profits or guarantees. Focus on the technical reasons for the signal.
      Keep the explanation concise, under 150 words.

      Signal Details:
      - Asset: ${signal.asset}
      - Direction: ${signal.direction}
      - Timeframe: ${signal.timeframe}
      - Strategy Used: "${signal.strategy}"
      - Key Confirmations Triggered: ${signal.confirmations.join(', ')}

      Start your explanation with "Here's the analysis for this ${signal.asset} signal:"
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      return 'There was an error getting the AI analysis. Please try again later.';
    } finally {
      this.isLoading.set(false);
    }
  }
}
