import * as vscode from 'vscode';

export class SettingsUI {
    static async showSettings(context: vscode.ExtensionContext) {
        const config = vscode.workspace.getConfiguration('aiAssistant');

        const provider = await vscode.window.showQuickPick(
            ['groq', 'deepseek', 'gemini'],
            { placeHolder: 'Select AI Provider' }
        );

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

    private static getDefaultModel(provider: string): string {
        switch (provider) {
            case 'groq': return 'mixtral-8x7b-32768';
            case 'deepseek': return 'deepseek-chat';
            case 'gemini': return 'gemini-pro';
            default: return '';
        }
    }
}