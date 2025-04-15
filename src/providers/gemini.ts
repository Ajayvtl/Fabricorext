import axios from 'axios';
import { AIProviderBase } from './base';

export class GeminiHandler extends AIProviderBase {
    private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta';

    async chatComplete(payload: any): Promise<string> {
        try {
            const response = await axios.post(
                `${this.apiUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
                payload
            );
            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error('Failed to get response from Gemini');
        }
    }
}