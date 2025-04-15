"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepSeekHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const base_1 = require("./base");
class DeepSeekHandler extends base_1.AIProviderBase {
    constructor() {
        super(...arguments);
        this.apiUrl = 'https://api.deepseek.com/v1';
    }
    async chatComplete(payload) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/chat/completions`, payload, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        }
        catch (error) {
            console.error('DeepSeek API error:', error);
            throw new Error('Failed to get response from DeepSeek');
        }
    }
}
exports.DeepSeekHandler = DeepSeekHandler;
//# sourceMappingURL=deepseek.js.map