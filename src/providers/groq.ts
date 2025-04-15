import axios from 'axios';
import { AIProviderBase } from './base';

export class GroqHandler extends AIProviderBase {
    private readonly apiUrl = 'https://api.groq.com/openai/v1';

    async chatComplete(payload: any): Promise<string> {
        try {
            const response = await axios.post(`${this.apiUrl}/chat/completions`, payload, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Groq API error:', error);
            throw new Error('Failed to get response from Groq');
        }
    }
}