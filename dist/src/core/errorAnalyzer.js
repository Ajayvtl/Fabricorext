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
exports.ErrorAnalyzer = void 0;
const vscode = __importStar(require("vscode"));
class ErrorAnalyzer {
    constructor(aiGateway) {
        this.aiGateway = aiGateway;
        this._disposables = [];
        this._diagnostics = vscode.languages.createDiagnosticCollection('ai-errors');
        this._setupErrorMonitoring();
    }
    _setupErrorMonitoring() {
        this._disposables.push(vscode.workspace.onDidChangeTextDocument(async (e) => {
            await this._analyzeDocument(e.document);
        }), vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            if (editor) {
                await this._analyzeDocument(editor.document);
            }
        }));
    }
    async _analyzeDocument(document) {
        try {
            const text = document.getText();
            const uri = document.uri;
            // Basic syntax error detection (expand with AI later)
            const errors = await this._detectErrors(text);
            this._diagnostics.set(uri, errors);
        }
        catch (error) {
            console.error('Error analysis failed:', error);
        }
    }
    async _detectErrors(code) {
        // Placeholder - will integrate with AI Gateway
        return [];
    }
    dispose() {
        this._diagnostics.dispose();
        this._disposables.forEach(d => d.dispose());
    }
}
exports.ErrorAnalyzer = ErrorAnalyzer;
//# sourceMappingURL=errorAnalyzer.js.map