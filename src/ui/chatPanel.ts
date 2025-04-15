import * as vscode from 'vscode';
import { AIGateway } from '../ai/gateway';

export class ChatPanel {
    // 1. Define the viewType as a static property
    public static readonly viewType = 'aiDevAssistantChat';

    private static _currentPanel: ChatPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _aiGateway: AIGateway; // ✅ add this line
    private _disposables: vscode.Disposable[] = [];

    // 2. Make constructor private
    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, aiGateway: AIGateway) {
        this._panel = panel;
        this._aiGateway = aiGateway; // Initialize here
        this._initializePanel(context);
    }

    private _initializePanel(context: vscode.ExtensionContext) {
        this._panel.title = 'AI Development Assistant';
        this._panel.webview.html = this._getHtmlContent();

        this._panel.webview.onDidReceiveMessage(
            message => this._handleMessage(message),
            null,
            this._disposables
        );

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    private _handleMessage(message: any) {
        switch (message.command) {
            case 'generate':
                this._handleGenerateRequest(message.prompt, message.model);
                break;
            case 'openSettings':
                vscode.commands.executeCommand('ai-dev-assistant.settings');
                break;
        }
    }

    private async _handleGenerateRequest(prompt: string, model: string) {
        try {
            const response = await this._aiGateway.generateCode(prompt, model);
            this._panel.webview.postMessage({
                command: 'response',
                content: response
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(String(error));
            }
        }
    }

    private _getHtmlContent(): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Assistant</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                input, select, button {
                    padding: 8px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                }
                button {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    cursor: pointer;
                    border: none;
                    padding: 10px;
                }
                .output {
                    border: 1px solid var(--vscode-panel-border);
                    padding: 10px;
                    min-height: 100px;
                    background-color: var(--vscode-panel-background);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>AI Development Assistant</h1>
                
                <div class="input-group">
                    <label for="prompt">Enter your request:</label>
                    <textarea id="prompt" rows="4"></textarea>
                </div>
                
                <div class="input-group">
                    <label for="model">Model:</label>
                    <select id="model">
                        <option value="mixtral-8x7b-32768">Mixtral (Groq)</option>
                        <option value="deepseek-chat">DeepSeek Chat</option>
                        <option value="gemini-pro">Gemini Pro</option>
                    </select>
                </div>
                
                <button id="generateBtn">Generate Code</button>
                <button id="settingsBtn">Settings</button>
                
                <div class="output" id="output"></div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                document.getElementById('generateBtn').addEventListener('click', () => {
                    const prompt = document.getElementById('prompt').value;
                    const model = document.getElementById('model').value;
                    
                    vscode.postMessage({
                        command: 'generate',
                        prompt: prompt,
                        model: model
                    });
                });
                
                document.getElementById('settingsBtn').addEventListener('click', () => {
                    vscode.postMessage({
                        command: 'openSettings'
                    });
                });
                
                // Handle responses from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'response') {
                        document.getElementById('output').innerText = message.content;
                    }
                });
            </script>
        </body>
        </html>`;
    }

    // 3. Static method to create/show panel
    public static createOrShow(context: vscode.ExtensionContext, aiGateway: AIGateway) {
        const column = vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;

        if (ChatPanel._currentPanel) {
            ChatPanel._currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            ChatPanel.viewType, // Using the static property
            'AI Development Assistant',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [context.extensionUri]
            }
        );

        ChatPanel._currentPanel = new ChatPanel(panel, context, aiGateway);
    }

    public dispose() {
        ChatPanel._currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) disposable.dispose();
        }
    }
}