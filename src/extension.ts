import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { ChatPanel } from './ui/chatPanel';
import { AIGateway } from './ai/gateway';
import { SettingsUI } from './ui/settingsUI';
export function activate(context: vscode.ExtensionContext) {
    const aiGateway = new AIGateway(context.secrets);

    context.subscriptions.push(
        vscode.commands.registerCommand('ai-dev-assistant.activate', () => {
            ChatPanel.createOrShow(context, aiGateway); // Pass the gateway
        }),
        vscode.commands.registerCommand('ai-dev-assistant.settings', () => {
            SettingsUI.showSettings(context);
        })
    );
}


export function deactivate() {
    console.log('AI Dev Assistant deactivated');
}
