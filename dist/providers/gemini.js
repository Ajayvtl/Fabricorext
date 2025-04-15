"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const base_1 = require("./base");
class GeminiHandler extends base_1.AIProviderBase {
    constructor() {
        super(...arguments);
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }
    async chatComplete(payload) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, payload);
            return response.data.candidates[0].content.parts[0].text;
        }
        catch (error) {
            console.error('Gemini API error:', error);
            throw new Error('Failed to get response from Gemini');
        }
    }
}
exports.GeminiHandler = GeminiHandler;
//# sourceMappingURL=gemini.js.map