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
exports.ChatPanel = void 0;
const vscode = __importStar(require("vscode"));
class ChatPanel {
    // 2. Make constructor private
    constructor(panel, context) {
        this._disposables = [];
        this._panel = panel;
        this._initializePanel(context);
    }
    _initializePanel(context) {
        this._panel.title = 'AI Development Assistant';
        this._panel.webview.html = this._getHtmlContent();
        this._panel.webview.onDidReceiveMessage(message => this._handleMessage(message), null, this._disposables);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    _handleMessage(message) {
        switch (message.command) {
            case 'test':
                vscode.window.showInformationMessage(message.text);
                break;
        }
    }
    _getHtmlContent() {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Assistant</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                button { padding: 8px 16px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>AI Development Assistant</h1>
            <button id="testButton">Test Interaction</button>
            <script>
                const vscode = acquireVsCodeApi();
                document.getElementById('testButton').addEventListener('click', () => {
                    vscode.postMessage({
                        command: 'test',
                        text: 'Button clicked successfully!'
                    });
                });
            </script>
        </body>
        </html>`;
    }
    // 3. Static method to create/show panel
    static createOrShow(context) {
        const column = vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;
        if (ChatPanel._currentPanel) {
            ChatPanel._currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(ChatPanel.viewType, // Using the static property
        'AI Development Assistant', column, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [context.extensionUri]
        });
        ChatPanel._currentPanel = new ChatPanel(panel, context);
    }
    dispose() {
        ChatPanel._currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable)
                disposable.dispose();
        }
    }
}
exports.ChatPanel = ChatPanel;
// 1. Define the viewType as a static property
ChatPanel.viewType = 'aiDevAssistantChat';
//# sourceMappingURL=chatPanel.js.map