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
exports.SettingsUI = void 0;
const vscode = __importStar(require("vscode"));
class SettingsUI {
    static async showSettings(context) {
        const config = vscode.workspace.getConfiguration('aiAssistant');
        const provider = await vscode.window.showQuickPick(['groq', 'deepseek', 'gemini'], { placeHolder: 'Select AI Provider' });
        if (provider) {
            await config.update('provider', provider, true);
            const apiKey = await vscode.window.showInputBox({
                prompt: `Enter ${provider} API Key`,
                password: true
            });
            if (apiKey) {
                await context.secrets.store('aiAssistant.apiKey', apiKey);
            }
            const model = await vscode.window.showInputBox({
                prompt: `Enter model (e.g. ${this.getDefaultModel(provider)})`,
                value: config.get('model') || ''
            });
            if (model) {
                await config.update('model', model, true);
            }
        }
    }
    static getDefaultModel(provider) {
        switch (provider) {
            case 'groq': return 'mixtral-8x7b-32768';
            case 'deepseek': return 'deepseek-chat';
            case 'gemini': return 'gemini-pro';
            default: return '';
        }
    }
}
exports.SettingsUI = SettingsUI;
//# sourceMappingURL=settingsUI.js.map