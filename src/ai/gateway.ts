import { DeepSeekHandler } from '../providers/deepseek';
import { GroqHandler } from '../providers/groq';
import { GeminiHandler } from '../providers/gemini';
import * as vscode from 'vscode';

type AIProvider = 'groq' | 'deepseek' | 'gemini';

interface AIConfig {
    provider: AIProvider;
    apiKey: string;
}

export class AIGateway {
    private provider: DeepSeekHandler | GroqHandler | GeminiHandler | null = null;

    constructor(private secrets: vscode.SecretStorage) {
        this.initializeProvider();
    }

    private async initializeProvider(): Promise<void> {
        try {
            const config = await this.getConfig();
            this.provider = this.createProvider(config);
        } catch (error) {
            console.error('Failed to initialize AI provider:', error);
            throw new Error(`AI provider initialization failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async getConfig(): Promise<AIConfig> {
        const config = vscode.workspace.getConfiguration('aiAssistant');
        const apiKey = await this.secrets.get('aiAssistant.apiKey') || '';

        if (!apiKey) {
            throw new Error('No API key configured for AI provider');
        }

        return {
            provider: config.get<AIProvider>('provider') || 'groq',
            apiKey
        };
    }

    private createProvider(config: AIConfig): DeepSeekHandler | GroqHandler | GeminiHandler {
        switch (config.provider) {
            case 'groq': return new GroqHandler(config.apiKey);
            case 'deepseek': return new DeepSeekHandler(config.apiKey);
            case 'gemini': return new GeminiHandler(config.apiKey);
            default: throw new Error(`Unsupported provider: ${config.provider}`);
        }
    }

    public async generatePrototypes(requirements: string): Promise<any> {
        if (!this.provider) {
            throw new Error('AI provider not initialized');
        }

        const prompt = `Generate 3 technical prototypes for: ${requirements}
      Respond with JSON format: {
        prototypes: {
          name: string,
          objectives: string[],
          techStack: string[],
          architecture: string
        }[]
      }`;

        const response = await this.provider.chatComplete({
            model: this.getDefaultModel(),
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        });

        return JSON.parse(response);
    }
    public async generateCode(prompt: string, model?: string): Promise<string> {
        if (!this.provider) {
            throw new Error('AI provider not configured. Please check your settings.');
        }

        try {
            const config = vscode.workspace.getConfiguration('aiAssistant');
            const finalModel = model || config.get('model') || this.getDefaultModel();

            if (!prompt?.trim()) {
                throw new Error('Prompt cannot be empty');
            }

            const response = await this.provider.chatComplete({
                model: finalModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            });

            if (!response) {
                throw new Error('Empty response from AI provider');
            }

            return response;
        } catch (error) {
            console.error('AI Gateway Error:', error);
            throw new Error(`Failed to generate code: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    private getDefaultModel(): string {
        if (!this.provider) {
            throw new Error('AI provider not initialized');
        }

        if (this.provider instanceof GroqHandler) return 'mixtral-8x7b-32768';
        if (this.provider instanceof DeepSeekHandler) return 'deepseek-chat';
        return 'gemini-pro';
    }
}