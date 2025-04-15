"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIGateway = void 0;
const deepseek_1 = require("../providers/deepseek");
const groq_1 = require("../providers/groq");
const gemini_1 = require("../providers/gemini");
const vscode = __importStar(require("vscode"));
class AIGateway {
    constructor(secrets) {
        this.secrets = secrets;
        this.provider = null;
        this.initializeProvider();
    }
    async initializeProvider() {
        try {
            const config = await this.getConfig();
            this.provider = this.createProvider(config);
        }
        catch (error) {
            console.error('Failed to initialize AI provider:', error);
            throw new Error(`AI provider initialization failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getConfig() {
        const config = vscode.workspace.getConfiguration('aiAssistant');
        const apiKey = await this.secrets.get('aiAssistant.apiKey') || '';
        if (!apiKey) {
            throw new Error('No API key configured for AI provider');
        }
        return {
            provider: config.get('provider') || 'groq',
            apiKey
        };
    }
    createProvider(config) {
        switch (config.provider) {
            case 'groq': return new groq_1.GroqHandler(config.apiKey);
            case 'deepseek': return new deepseek_1.DeepSeekHandler(config.apiKey);
            case 'gemini': return new gemini_1.GeminiHandler(config.apiKey);
            default: throw new Error(`Unsupported provider: ${config.provider}`);
        }
    }
    async generatePrototypes(requirements) {
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
    getDefaultModel() {
        if (!this.provider) {
            throw new Error('AI provider not initialized');
        }
        if (this.provider instanceof groq_1.GroqHandler)
            return 'mixtral-8x7b-32768';
        if (this.provider instanceof deepseek_1.DeepSeekHandler)
            return 'deepseek-chat';
        return 'gemini-pro';
    }
}
exports.AIGateway = AIGateway;
//# sourceMappingURL=gateway.js.map