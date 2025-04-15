import * as vscode from 'vscode';
import { AIGateway } from '../ai/gateway';

export class ErrorAnalyzer {
    private _diagnostics: vscode.DiagnosticCollection;
    private _disposables: vscode.Disposable[] = [];

    constructor(private aiGateway: AIGateway) {
        this._diagnostics = vscode.languages.createDiagnosticCollection('ai-errors');
        this._setupErrorMonitoring();
    }

    private _setupErrorMonitoring() {
        this._disposables.push(
            vscode.workspace.onDidChangeTextDocument(async (e) => {
                await this._analyzeDocument(e.document);
            }),
            vscode.window.onDidChangeActiveTextEditor(async (editor) => {
                if (editor) {
                    await this._analyzeDocument(editor.document);
                }
            })
        );
    }

    private async _analyzeDocument(document: vscode.TextDocument) {
        try {
            const text = document.getText();
            const uri = document.uri;

            // Basic syntax error detection (expand with AI later)
            const errors = await this._detectErrors(text);
            this._diagnostics.set(uri, errors);
        } catch (error) {
            console.error('Error analysis failed:', error);
        }
    }

    private async _detectErrors(code: string): Promise<vscode.Diagnostic[]> {
        // Placeholder - will integrate with AI Gateway
        return [];
    }

    public dispose() {
        this._diagnostics.dispose();
        this._disposables.forEach(d => d.dispose());
    }
}