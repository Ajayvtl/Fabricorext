import * as vscode from 'vscode';

export class ChatPanel {
    // 1. Define the viewType as a static property
    public static readonly viewType = 'aiDevAssistantChat';

    private static _currentPanel: ChatPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    // 2. Make constructor private
    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        this._panel = panel;
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
            case 'test':
                vscode.window.showInformationMessage(message.text);
                break;
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
    public static createOrShow(context: vscode.ExtensionContext) {
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

        ChatPanel._currentPanel = new ChatPanel(panel, context);
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